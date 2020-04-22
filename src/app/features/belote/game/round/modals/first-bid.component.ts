import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-first-bid',
  template: `
    <app-card class="mat-elevation-z4" [ngClass]="card" [card]="card"></app-card>
    <button mat-raised-button color="primary" [mat-dialog-close]="color">
      Prendre à <span class="color">{{ color }}</span>
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
  readonly color;
  readonly value;
  readonly card;

  constructor(@Inject(MAT_DIALOG_DATA) data: string) {
    this.card = data;
    [this.value, this.color] = data.split(' ');
  }
}
