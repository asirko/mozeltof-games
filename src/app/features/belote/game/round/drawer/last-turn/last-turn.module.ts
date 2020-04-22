import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LastTurnComponent } from './last-turn.component';
import { CardModule } from '../../card/card.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [LastTurnComponent],
  imports: [CommonModule, CardModule, MatIconModule],
  exports: [LastTurnComponent],
})
export class LastTurnModule {}
