import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { PseudoComponent } from './pseudo.component';
import { map, mapTo, switchMap, tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

export const PSEUDO_KEY = 'playerPseudo';
export const PLAYER_ID_KEY = 'playerId';

@Injectable(/*provided by the module since it requires also the modal component*/)
export class PseudoGuard implements CanActivate {
  constructor(private angularFirestore: AngularFirestore, private matDialog: MatDialog) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (localStorage.getItem(PSEUDO_KEY)) {
      return true;
    }
    const dialogRef = this.matDialog.open(PseudoComponent, { width: '250px', disableClose: true });
    return dialogRef.afterClosed().pipe(
      switchMap(pseudo => (pseudo ? this.savePlayerPseudo(pseudo) : of(false))), //
    );
  }

  private savePlayerPseudo(pseudo: string): Observable<boolean> {
    return fromPromise(this.angularFirestore.collection('players').add({ pseudo })).pipe(
      map(v => v.id),
      tap(id => localStorage.setItem(PLAYER_ID_KEY, id)),
      tap(() => localStorage.setItem(PSEUDO_KEY, pseudo)),
      mapTo(true),
    );
  }
}
