import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { BeloteService } from '../../belote.service';
import { FormControl } from '@angular/forms';
import { takeUntil, tap } from 'rxjs/operators';
import { PLAYER_ID_KEY } from '../../../../shared/pseudo/pseudo.guard';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaitingRoomComponent implements OnDestroy {
  readonly toggleCtrl = new FormControl(false);
  readonly currentPlayerId = localStorage.getItem(PLAYER_ID_KEY);
  readonly game$ = this.beloteService.fireGame.valueChanges().pipe(
    tap(v => {
      if (v.players.every(p => p.ready) && v.players.length === 4) {
        if (v.players[0].id === this.currentPlayerId) {
          this.beloteService.initGame(this.currentPlayerId);
        }

        this.router.navigate(['..', 'round'], { relativeTo: this.route });
      }
      const isReady = v.players.find(p => p.id === this.currentPlayerId).ready;
      this.toggleCtrl.patchValue(isReady, { emitEvent: false });
    }),
  );

  private readonly destroy$ = new Subject<void>();

  constructor(private beloteService: BeloteService, private router: Router, private route: ActivatedRoute) {
    this.toggleCtrl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(isReady => this.beloteService.updatePlayerStatus(isReady));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
