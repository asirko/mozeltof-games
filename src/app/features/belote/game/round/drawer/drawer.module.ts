import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerComponent } from './drawer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LastTurnModule } from './last-turn/last-turn.module';

@NgModule({
  declarations: [DrawerComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatDividerModule, MatTooltipModule, LastTurnModule],
  exports: [DrawerComponent],
})
export class DrawerModule {}
