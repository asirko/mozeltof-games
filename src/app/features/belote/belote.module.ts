import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeloteRoutingModule } from './belote-routing.module';
import { ListModule } from './list/list.module';
import { GameModule } from './game/game.module';
import { RoundModule } from './game/round/round.module';
import { WaitingRoomModule } from './game/waiting-room/waiting-room.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, BeloteRoutingModule, ListModule, GameModule, RoundModule, WaitingRoomModule],
  exports: [],
})
export class BeloteModule {}
