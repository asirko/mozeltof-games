import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BeloteColor } from '../../../belote';

@Component({
  selector: 'app-first-bid',
  template: `
    <button mat-raised-button *ngFor="let color of colorChoice" color="primary" [mat-dialog-close]="color">Prendre à {{ color }}</button>
    <button mat-raised-button color="accent" [mat-dialog-close]="null">Passer</button>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
      }
      button {
        margin: 5px 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondBidComponent {
  readonly colorChoice: BeloteColor[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: BeloteColor) {
    this.colorChoice = ['♥', '♦', '♣', '♠'].filter(v => v !== data.split(' ')[1]) as BeloteColor[];
  }
}
