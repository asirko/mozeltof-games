import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameListComponent } from './game-list.component';

const routes: Routes = [
  {
    path: '',
    component: GameListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameListRoutingModule {}
