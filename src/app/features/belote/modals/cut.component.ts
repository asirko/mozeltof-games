import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-cut',
  template: `
    <h3>Comment souhaitez-vous couper&nbsp;?</h3>
    <div class="selector">
      <mat-slider vertical min="6" max="26" [value]="initialValue" #slider></mat-slider>
      <button mat-raised-button color="primary" appAutofocus [mat-dialog-close]="slider.value">Valider</button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .selector {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CutComponent {
  initialValue = Math.floor(Math.random() * 21) + 6;
}
