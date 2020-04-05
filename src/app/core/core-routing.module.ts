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
        redirectTo: 'belote',
      },
      {
        path: 'belote',
        loadChildren: () => import('../features/belote/belote.module').then(m => m.BeloteModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
