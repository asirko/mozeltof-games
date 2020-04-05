import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaitingRoomComponent } from './waiting-room.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [WaitingRoomComponent],
  imports: [CommonModule, MatButtonToggleModule, ReactiveFormsModule],
  exports: [WaitingRoomComponent],
})
export class WaitingRoomModule {}
