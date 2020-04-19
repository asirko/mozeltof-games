import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PastTurn } from '../../../belote';

@Component({
  selector: 'app-first-bid',
  template: `
    <div *ngFor="let pa of data.cards">
      <span>{{ pa.pseudo }} <mat-icon *ngIf="pa.hasWon">star</mat-icon></span>
      <app-card [card]="pa.value" [ngClass]="pa.value" class="mat-elevation-z4"></app-card>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        width: 100%;
        justify-content: space-between;
        counter-reset: card-counter;
      }

      div {
        counter-increment: card-counter;
      }

      span {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 30px;
      }
      span:before {
        content: counter(card-counter) '. ';
      }
      mat-icon {
        color: gold;
        text-shadow: 0 1px 2px black;
      }

      app-card {
        margin-right: unset;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastTurnComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: PastTurn) {}
}
