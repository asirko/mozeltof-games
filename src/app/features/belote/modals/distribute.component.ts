import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-distribute',
  template: `
    <div cdkDrag cdkDragRootElement=".cdk-overlay-pane">
      <h3>Comment souhaitez-vous distribuer&nbsp;?</h3>
      <div class="btn-area">
        <button mat-raised-button color="primary" [mat-dialog-close]="[2, 3]">2 - 3</button>
        <button mat-raised-button color="primary" [mat-dialog-close]="[3, 2]">3 - 2</button>
      </div>
    </div>
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
