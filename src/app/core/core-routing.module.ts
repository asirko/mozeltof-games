import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { PseudoGuard } from '../shared/pseudo/pseudo.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [PseudoGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'game-list',
      },
      {
        path: 'belote',
        loadChildren: () => import('../features/belote/belote.module').then(m => m.BeloteModule),
      },
      {
        path: 'game-list',
        loadChildren: () => import('../features/game-list/game-list.module').then(m => m.GameListModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
