import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  exports: [ListComponent],
})
export class ListModule {}
