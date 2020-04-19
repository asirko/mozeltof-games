import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BeloteStats } from '../../../belote';

@Component({
  selector: 'app-stats',
  template: `
    <table>
      <tr>
        <th>{{ data.team1.name.join(' - ') }}</th>
        <th>{{ data.team2.name.join(' - ') }}</th>
      </tr>
      <tr *ngFor="let score of data.team1.score; let i = index">
        <td>{{ data.team1.score[i] }}</td>
        <td>{{ data.team2.score[i] }}</td>
      </tr>
      <tr>
        <th>{{ getTotal(data.team1.score) }}</th>
        <th>{{ getTotal(data.team2.score) }}</th>
      </tr>
    </table>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      table {
        width: 100%;
        text-align: center;
        table-layout: fixed;
        border-collapse: collapse;
      }

      tr:nth-child(2n + 1) td {
        background-color: rgba(200, 200, 200, 0.3);
      }

      tr:first-child th {
        border-bottom: 1px solid black;
      }

      th:first-child,
      td:first-child {
        border-right: 1px solid black;
        width: 50%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: BeloteStats) {}

  getTotal(scores: number[]): number {
    return scores.reduce((sum, point) => sum + point);
  }
}
