import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundComponent } from './round.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DistributeComponent } from './distribute.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [RoundComponent, DistributeComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  exports: [RoundComponent, DistributeComponent],
})
export class RoundModule {}
