import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundComponent } from './round.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DistributeComponent } from './modals/distribute.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FirstBidComponent } from './modals/first-bid.component';
import { SecondBidComponent } from './modals/second-bid.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CardModule } from './card/card.module';

@NgModule({
  declarations: [RoundComponent, DistributeComponent, FirstBidComponent, SecondBidComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, DragDropModule, CardModule],
  exports: [RoundComponent],
})
export class RoundModule {}
