import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { first, map, mapTo, switchMap, tap } from 'rxjs/operators';
import { Belote, BeloteColor, getRandomDeck, Player } from './belote';
import { PLAYER_ID_KEY, PSEUDO_KEY } from '../../shared/pseudo/pseudo.guard';
import { fromPromise } from 'rxjs/internal-compatibility';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class BeloteService implements CanActivate {
  fireGame: AngularFirestoreDocument<Belote>;

  constructor(private angularFirestore: AngularFirestore, private matSnackBar: MatSnackBar) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const id = route.params.id;
    this.fireGame = this.angularFirestore.collection<Belote>('games').doc('/' + id);
    return this.fireGame.valueChanges().pipe(
      first(),
      switchMap(gameValue => {
        if (gameValue.players?.some(p => p.id === null)) {
          console.warn('strangely some player have no id');
        }
        const players: Player[] = gameValue.players?.filter(p => !!p.id) || [];
        const isAlreadyIn = players.some(p => p.id === localStorage.getItem(PLAYER_ID_KEY));

        if (!isAlreadyIn && players.length >= 4) {
          this.matSnackBar.open('La partie est déjà complète', 'fermer', { duration: 3000 });
          return of(false);
        }
        if (!isAlreadyIn && players.length < 4) {
          players.push({
            pseudo: localStorage.getItem(PSEUDO_KEY),
            id: localStorage.getItem(PLAYER_ID_KEY),
            ready: false,
            hand: [],
          });
        }
        return fromPromise(this.fireGame.update({ players })).pipe(mapTo(true));
      }),
    );
  }

  updatePlayerStatus(ready: boolean) {
    const currentPlayerId = localStorage.getItem(PLAYER_ID_KEY);
    this.fireGame
      .valueChanges()
      .pipe(
        first(),
        map(v => v.players.map(p => (p.id === currentPlayerId ? { ...p, ready } : p))),
        tap(players => this.fireGame.update({ players })),
      )
      .subscribe();
  }

  initGame(playerId: string): Observable<any> {
    return this.fireGame.valueChanges().pipe(
      first(),
      tap((game: Belote) =>
        this.fireGame.update({
          draw: getRandomDeck(),
          turnTo: playerId,
          players: game.players.map(p => ({
            id: p.id,
            pseudo: p.pseudo,
            ready: p.ready,
            playedCard: null,
            hand: [],
            isFirst: null,
          })),
          atout: null,
          isSecondBid: false,
          hasBeenCut: false,
          whoTook: null,
          pastTurns: [],
          stats: {
            team1: {
              id: [game.players[0].id, game.players[2].id],
              name: [game.players[0].pseudo, game.players[2].pseudo],
              score: [],
            },
            team2: {
              id: [game.players[1].id, game.players[3].id],
              name: [game.players[1].pseudo, game.players[3].pseudo],
              score: [],
            },
          },
        }),
      ),
    );
  }

  updateGame(partialGame: Partial<Belote>) {
    this.fireGame.update(partialGame);
  }

  getPlayableCards(playedCards: string[], playerHand: string[], atout: BeloteColor, requestedColor: BeloteColor): string[] {
    if (playedCards.every(c => !c)) {
      return [...playerHand];
    }

    const playerCardsOfRequestedColor = playerHand.filter(predicateColor(requestedColor));
    if (playerCardsOfRequestedColor.length && requestedColor !== atout) {
      return playerCardsOfRequestedColor;
    } else if (playerCardsOfRequestedColor.length && requestedColor === atout) {
      return getBiggerAtoutsOrAll(playedCards, playerCardsOfRequestedColor, atout);
    }

    // else player has no cards of requested color
    const playerAtout = playerHand.filter(predicateColor(atout));
    const isAllyMaster = this.getBestCardIndex(playedCards, requestedColor, atout) === 2;
    if (playerAtout.length === 0 || (isAllyMaster && requestedColor !== atout)) {
      return [...playerHand];
    } else {
      return getBiggerAtoutsOrAll(playedCards, playerAtout, atout);
    }
  }

  getBestCardIndex(playedCard: string[], requestedColor: BeloteColor, atout: BeloteColor): number {
    const playedAtouts = playedCard.filter(predicateColor(atout));
    if (playedAtouts.length) {
      const bestAtout = maxCard(playedAtouts, { isAtout: true });
      return playedCard.indexOf(bestAtout);
    }
    const playedRequestedColor = playedCard.filter(predicateColor(requestedColor));
    const bestCard = maxCard(playedRequestedColor);
    return playedCard.indexOf(bestCard);
  }

  calculateTurnScore(game: Belote) {
    const team1Cards = game.pastTurns
      .filter(turn => game.stats.team1.id.includes(turn.cards.find(c => c.hasWon).id))
      .map(c => c.cards)
      .reduce((flat, arr) => flat.concat(arr), [])
      .map(c => c.value);
    const team2Cards = game.pastTurns
      .filter(turn => game.stats.team2.id.includes(turn.cards.find(c => c.hasWon).id))
      .map(c => c.cards)
      .reduce((flat, arr) => flat.concat(arr), [])
      .map(c => c.value);
    const team1GainedPoints = calculateCardsValue(team1Cards, game.atout);
    const team2GainedPoints = calculateCardsValue(team2Cards, game.atout);
    const lastWinnerId = game.pastTurns[game.pastTurns.length - 1].cards.find(c => c.hasWon).id;
    const team1WonLast = game.stats.team1.id.includes(lastWinnerId);
    const team1Score = team1WonLast ? team1GainedPoints + 10 : team1GainedPoints;
    const team2Score = !team1WonLast ? team2GainedPoints + 10 : team2GainedPoints;
    return this.updateGame({
      stats: {
        team1: { ...game.stats.team1, score: [...game.stats.team1.score, team1Score] },
        team2: { ...game.stats.team2, score: [...game.stats.team2.score, team2Score] },
      },
      pastTurns: [],
      requestedColor: null,
      atout: null,
      isSecondBid: false,
      hasBeenCut: false,
      whoTook: null,
      draw: Math.random() >= 0.5 ? team1Cards.concat(team2Cards) : team2Cards.concat(team1Cards),
      turnTo: game.players.find(p => p.isFirst).id,
    });
  }
}

function compareValueCards(valueA: string, valueB: string, options: { isAtout?: boolean } = {}): number {
  if (valueA === valueB) {
    throw new Error('Can not compare equivalent value');
  }
  const order = options.isAtout ? ['7', '8', 'Q', 'K', '10', 'A', '9', 'J'] : ['7', '8', '9', 'J', 'Q', 'K', '10', 'A'];
  const rankA = order.findIndex(v => v === valueA);
  const rankB = order.findIndex(v => v === valueB);
  return rankA - rankB;
}

function maxCard(cards: string[], options: { isAtout?: boolean } = {}): string {
  return cards
    .filter(c => !!c)
    .reduce((best, card) => {
      const bestValue = best.split(' ')[0];
      const cardValue = card.split(' ')[0];
      return compareValueCards(bestValue, cardValue, options) > 0 ? best : card;
    });
}

function getBiggerAtoutsOrAll(playedCards: string[], playerAtouts: string[], atout: BeloteColor): string[] {
  const playedAtouts = playedCards.filter(predicateColor(atout));
  if (!playedAtouts?.length) {
    return playerAtouts;
  }
  const bestPlayedAtoutsValue = maxCard(playedAtouts, { isAtout: true }).split(' ')[0];
  const betterAtouts = playerAtouts.filter(c => compareValueCards(bestPlayedAtoutsValue, c.split(' ')[0], { isAtout: true }) < 0);
  return betterAtouts.length ? betterAtouts : playerAtouts;
}

function predicateColor(color: BeloteColor): (card: string) => boolean {
  return card => card?.split(' ')[1] === color;
}

function calculateCardValue(card: string, atout: BeloteColor): number {
  const classicValues = [
    { value: '7', point: 0 },
    { value: '8', point: 0 },
    { value: '9', point: 0 },
    { value: 'J', point: 2 },
    { value: 'Q', point: 3 },
    { value: 'K', point: 4 },
    { value: '10', point: 10 },
    { value: 'A', point: 11 },
  ];
  const atoutValues = [
    { value: '7', point: 0 },
    { value: '8', point: 0 },
    { value: 'Q', point: 3 },
    { value: 'K', point: 4 },
    { value: '10', point: 10 },
    { value: 'A', point: 11 },
    { value: '9', point: 14 },
    { value: 'J', point: 20 },
  ];
  const [value, color] = card.split(' ');
  const values = color === atout ? atoutValues : classicValues;
  return values.find(v => v.value === value).point;
}

function calculateCardsValue(cards: string[], atout: BeloteColor): number {
  return cards //
    .map(c => calculateCardValue(c, atout))
    .reduce((points, point) => points + point, 0);
}
