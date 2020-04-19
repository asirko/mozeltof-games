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
      tap(game =>
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
