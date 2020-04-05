import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { GameComponent } from './game/game.component';
import { PseudoGuard } from '../../shared/pseudo/pseudo.guard';
import { BeloteService } from './belote.service';
import { WaitingRoomComponent } from './game/waiting-room/waiting-room.component';
import { RoundComponent } from './game/round/round.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    component: ListComponent,
  },
  {
    path: 'game/:id',
    component: GameComponent,
    canActivate: [BeloteService],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'waiting-room',
      },
      {
        path: 'waiting-room',
        component: WaitingRoomComponent,
      },
      {
        path: 'round',
        component: RoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeloteRoutingModule {}
