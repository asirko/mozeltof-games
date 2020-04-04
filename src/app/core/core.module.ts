import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { LayoutModule } from './layout/layout.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, CoreRoutingModule, LayoutModule],
  exports: [CoreRoutingModule],
})
export class CoreModule {}
