import { Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, mapTo, pairwise } from 'rxjs/operators';
import { BeloteService } from './belote.service';
import { Belote } from './belote';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  readonly alerts$ = merge(
    this.showBelote$(), //
    this.showReBelote$(),
    this.showWhoTook$(),
    this.showWhoDistributes$(),
  );

  constructor(private beloteService: BeloteService) {}

  private showBelote$(): Observable<string> {
    return this.beloteService.game$.pipe(
      pairwise(),
      map(([prev, curr]) => !prev.beloteFor && !!curr.beloteFor),
      distinctUntilChanged(),
      filter(shouldShow => shouldShow),
      mapTo('Belote !'),
    );
  }
  private showReBelote$(): Observable<string> {
    return this.beloteService.game$.pipe(
      filter(game => !!game.beloteFor),
      pairwise(),
      map(([prev, curr]) => {
        const playedCard = curr.players.map(p => p.playedCard);
        const beloteCardPlayed = ['Q ' + curr.atout, 'K ' + curr.atout].find(b => playedCard.includes(b));
        const wasInPrev = prev.players.map(p => p.playedCard).includes(beloteCardPlayed);
        return !wasInPrev ? 'Re-Belote !' : null;
      }),
      distinctUntilChanged(),
      filter(shouldShow => !!shouldShow),
    );
  }

  private showWhoTook$(): Observable<string> {
    return this.beloteService.game$.pipe(
      pairwise(),
      filter(([prev, curr]: Belote[]) => !prev.whoTook && !!curr.whoTook),
      map(([, curr]: Belote[]) => curr),
      map(game => {
        const player = game.players.find(p => p.id === game.whoTook).pseudo;
        return `${player} a pris à ${game.atout}`;
      }),
      distinctUntilChanged(),
    );
  }

  private showWhoDistributes$(): Observable<string> {
    return this.beloteService.game$.pipe(
      pairwise(),
      filter(([prev, curr]: Belote[]) => prev.draw.length === 32 && curr.draw.length !== 32),
      map(([prev]: Belote[]) => prev.players.find(p => p.id === prev.turnTo).pseudo),
      map(pseudo => `${pseudo} a distribué`),
      distinctUntilChanged(),
    );
  }
}
