import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { LayoutModule } from './layout/layout.module';
import { PseudoModule } from '../shared/pseudo/pseudo.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, CoreRoutingModule, LayoutModule, PseudoModule],
  exports: [CoreRoutingModule],
})
export class CoreModule {}
