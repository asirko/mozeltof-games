import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { first, mapTo, switchMap, tap } from 'rxjs/operators';
import { Belote, BeloteColor, BeloteHistory, getRandomDeck, Player } from './belote';
import { PLAYER_ID_KEY, PSEUDO_KEY } from '../../shared/pseudo/pseudo.guard';
import { fromPromise } from 'rxjs/internal-compatibility';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class BeloteService implements CanActivate {
  private fireGame$ = new BehaviorSubject<AngularFirestoreDocument<Belote>>(null);
  readonly game$ = this.fireGame$.pipe(
    switchMap(fireGame => (fireGame ? fireGame.valueChanges() : of(null))), //
  );

  constructor(private angularFirestore: AngularFirestore, private matSnackBar: MatSnackBar) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const id = route.params.id;
    this.fireGame$.next(this.angularFirestore.collection<Belote>('games').doc('/' + id));
    return this.game$.pipe(
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
            hand: [],
          });
        }
        return fromPromise(this.fireGame$.getValue().update({ players })).pipe(mapTo(true));
      }),
    );
  }

  initGame(playerId: string): Observable<any> {
    return this.game$.pipe(
      first(),
      tap((game: Belote) =>
        this.fireGame$.getValue().update({
          draw: getRandomDeck(),
          turnTo: playerId,
          players: game.players.map(p => ({
            id: p.id,
            pseudo: p.pseudo,
            playedCard: null,
            hand: [],
            isFirst: null,
          })),
          atout: null,
          isSecondBid: false,
          hasBeenCut: false,
          whoTook: null,
          litige: 0,
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
          history: [],
        }),
      ),
    );
  }

  updateGame(partialGame: Partial<Belote>) {
    return this.fireGame$.getValue().update(partialGame);
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
    let team1Score = calculateCardsValue(team1Cards, game.atout);
    let team2Score = calculateCardsValue(team2Cards, game.atout);
    const lastWinnerId = game.pastTurns[game.pastTurns.length - 1].cards.find(c => c.hasWon).id;
    const team1WonLast = game.stats.team1.id.includes(lastWinnerId);
    if (team1WonLast) {
      team1Score += 10;
    } else {
      team2Score += 10;
    }

    if (game.beloteFor && game.stats.team1.id.includes(game.beloteFor)) {
      team1Score += 20;
    } else if (game.beloteFor && game.stats.team2.id.includes(game.beloteFor)) {
      team2Score += 20;
    }

    if (!game.whoTook) {
      throw new Error('game.whoTook empty');
    }
    const threshold = game.beloteFor ? 91 : 81;
    let litige = 0;
    if (game.stats.team1.id.includes(game.whoTook) && team1Score < threshold) {
      team1Score = 0;
      team2Score = 162 + game.litige;
    } else if (game.stats.team2.id.includes(game.whoTook) && team2Score < threshold) {
      team1Score = 162 + game.litige;
      team2Score = 0;
    } else if (game.stats.team1.id.includes(game.whoTook) && team1Score === threshold) {
      team1Score = 0;
      litige = threshold + game.litige;
      if (game.beloteFor && game.stats.team1.id.includes(game.beloteFor)) {
        team1Score += 20;
        litige -= 20;
      }
    } else if (game.stats.team2.id.includes(game.whoTook) && team2Score === threshold) {
      team2Score = 0;
      litige = threshold + game.litige;
      if (game.beloteFor && game.stats.team2.id.includes(game.beloteFor)) {
        team2Score += 20;
        litige -= 20;
      }
    } else if (game.stats.team1.id.includes(game.whoTook) && team1Score > threshold) {
      team1Score += game.litige;
    } else if (game.stats.team2.id.includes(game.whoTook) && team2Score > threshold) {
      team2Score += game.litige;
    }

    if (team1Cards.length === 0) {
      team2Score = 252 + game.litige;
      if (game.beloteFor && game.stats.team2.id.includes(game.beloteFor)) {
        team2Score += 20;
      }
    } else if (team2Cards.length === 0) {
      team1Score = 252 + game.litige;
      if (game.beloteFor && game.stats.team1.id.includes(game.beloteFor)) {
        team2Score += 20;
      }
    }

    const history: BeloteHistory[] = [
      ...game.history,
      {
        beloteFor: game.beloteFor,
        turns: [...game.pastTurns],
        whoTook: game.whoTook,
      },
    ];

    const turnToIndex = game.players.findIndex(p => p.isFirst) === 0 ? 3 : game.players.findIndex(p => p.isFirst) - 1;

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
      beloteFor: null,
      whoTook: null,
      litige,
      history,
      draw: Math.random() >= 0.5 ? team1Cards.concat(team2Cards) : team2Cards.concat(team1Cards),
      turnTo: game.players[turnToIndex].id,
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
