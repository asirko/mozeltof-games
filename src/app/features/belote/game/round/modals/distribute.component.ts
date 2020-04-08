import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-distribute',
  template: `
    <button mat-raised-button color="primary" [mat-dialog-close]="[2, 3]">2 - 3</button>
    <button mat-raised-button color="primary" [mat-dialog-close]="[3, 2]">3 - 2</button>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributeComponent {}
