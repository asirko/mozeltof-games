import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BeloteStats } from '../../belote';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent {
  @Input() stats: BeloteStats;

  constructor() {}

  getTotal(scores: number[]): number {
    return scores.reduce((sum, point) => sum + point, 0);
  }
}
