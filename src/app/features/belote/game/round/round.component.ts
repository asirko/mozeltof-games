import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BeloteService } from '../../belote.service';
import { map } from 'rxjs/operators';
import { PLAYER_ID_KEY } from '../../../../shared/pseudo/pseudo.guard';
import { Belote } from '../../belote';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundComponent {
  game$ = this.beloteService.fireGame.valueChanges().pipe(
    map(game => {
      const currentPlayerId = localStorage.getItem(PLAYER_ID_KEY);
      const currentPlayerIndex = game.players.findIndex(p => p.id === currentPlayerId);
      const players = game.players.map((p, i, list) => list[(i + currentPlayerIndex) % 4]);
      return { ...game, players } as Belote;
    }),
  );

  constructor(private beloteService: BeloteService) {}
}
