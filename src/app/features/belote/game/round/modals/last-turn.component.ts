import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-first-bid',
  template: ` <app-card *ngFor="let card of data" color="primary" [card]="card"></app-card> `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastTurnComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string[]) {}
}
