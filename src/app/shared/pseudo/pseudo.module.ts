import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PseudoComponent } from './pseudo.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PseudoGuard } from './pseudo.guard';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PseudoComponent],
  imports: [CommonModule, MatDialogModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  exports: [PseudoComponent, MatDialogModule],
  providers: [PseudoGuard],
})
export class PseudoModule {}
