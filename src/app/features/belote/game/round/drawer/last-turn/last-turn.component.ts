import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PastTurn } from '../../../../belote';

@Component({
  selector: 'app-last-turn',
  templateUrl: './last-turn.component.html',
  styleUrls: ['./last-turn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastTurnComponent {
  @Input() lastTurn: PastTurn;
  constructor() {}
}
