import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BeloteColor } from '../../../belote';

@Component({
  selector: 'app-first-bid',
  template: `
    <app-card class="mat-elevation-z4" [ngClass]="data" [card]="data"></app-card>
    <button mat-raised-button color="primary" [mat-dialog-close]="data">
      Prendre à <span class="color">{{ data.split(' ')[1] }}</span>
    </button>
    <button mat-raised-button color="accent" [mat-dialog-close]="null">Passer</button>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: stretch;
      }

      button {
        margin: 5px 0;
      }

      app-card {
        align-self: center;
        margin: 5px 0;
      }

      .color {
        font-size: 2em;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirstBidComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: BeloteColor) {}
}
