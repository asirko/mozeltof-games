import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeloteService } from './belote.service';
import { BeloteComponent } from './belote.component';

const routes: Routes = [
  {
    path: ':id',
    component: BeloteComponent,
    canActivate: [BeloteService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeloteRoutingModule {}
