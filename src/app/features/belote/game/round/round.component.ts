import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { BeloteService } from '../../belote.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { PLAYER_ID_KEY } from '../../../../shared/pseudo/pseudo.guard';
import { Belote } from '../../belote';
import { PseudoComponent } from '../../../../shared/pseudo/pseudo.component';
import { of, Subscription } from 'rxjs';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DistributeComponent } from './distribute.component';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundComponent implements OnDestroy {
  dialogDistributionSub: Subscription;

  game$ = this.beloteService.fireGame.valueChanges().pipe(
    map(game => {
      const currentPlayerId = localStorage.getItem(PLAYER_ID_KEY);
      const currentPlayerIndex = game.players.findIndex(p => p.id === currentPlayerId);
      const players = game.players.map((p, i, list) => list[(i + currentPlayerIndex) % 4]);
      return { ...game, players } as Belote;
    }),
    tap(game => this.manageDistribution(game)),
  );

  constructor(private beloteService: BeloteService, private matDialog: MatDialog) {}

  ngOnDestroy(): void {
    this.dialogDistributionSub?.unsubscribe();
  }

  manageDistribution(game: Belote) {
    if (game.turnTo === localStorage.getItem(PLAYER_ID_KEY) && !this.dialogDistributionSub) {
      this.dialogDistributionSub = this.matDialog
        .open(DistributeComponent, { width: '250px', disableClose: true })
        .afterClosed()
        .subscribe(v => {
          console.log(v);
        });
    }
  }
}
