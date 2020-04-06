import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { first, map, mapTo, switchMap, tap } from 'rxjs/operators';
import { Belote, getRandomDeck, Player } from './belote';
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

  initGame(playerId: string) {
    this.fireGame.update({ draw: getRandomDeck(), turnTo: playerId });
  }
}
