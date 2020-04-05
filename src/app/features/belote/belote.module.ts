import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeloteRoutingModule } from './belote-routing.module';
import { ListModule } from './list/list.module';
import { GameModule } from './game/game.module';
import { PseudoModule } from '../../shared/pseudo/pseudo.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, BeloteRoutingModule, ListModule, GameModule, PseudoModule],
  exports: [],
})
export class BeloteModule {}
