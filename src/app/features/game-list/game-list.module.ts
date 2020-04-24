import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameListRoutingModule } from './game-list-routing.module';
import { GameListComponent } from './game-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [GameListComponent],
  imports: [CommonModule, GameListRoutingModule, MatCardModule, MatButtonModule],
  exports: [GameListComponent],
})
export class GameListModule {}
