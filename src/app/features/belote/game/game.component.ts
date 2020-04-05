import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BeloteService } from '../belote.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  game$ = this.beloteService.fireGame.valueChanges();

  constructor(private beloteService: BeloteService) {}
}
