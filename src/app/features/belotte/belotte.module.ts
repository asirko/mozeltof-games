import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BelotteRoutingModule } from './belotte-routing.module';
import { ListModule } from './list/list.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, BelotteRoutingModule, ListModule],
  exports: [BelotteRoutingModule],
})
export class BelotteModule {}
