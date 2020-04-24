import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeloteRoutingModule } from './belote-routing.module';
import { BeloteComponent } from './belote.component';
import { DistributeComponent } from './modals/distribute.component';
import { FirstBidComponent } from './modals/first-bid.component';
import { SecondBidComponent } from './modals/second-bid.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CardModule } from './card/card.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DrawerModule } from './drawer/drawer.module';
import { CutComponent } from './modals/cut.component';
import { MatSliderModule } from '@angular/material/slider';
import { AutofocusModule } from '../../shared/directives/autofocus/autofocus.module';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [BeloteComponent, DistributeComponent, FirstBidComponent, SecondBidComponent, CutComponent],
  imports: [
    CommonModule,
    BeloteRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    DragDropModule,
    CardModule,
    MatSnackBarModule,
    MatSidenavModule,
    DrawerModule,
    MatSliderModule,
    AutofocusModule,
    ClipboardModule,
  ],
  exports: [],
})
export class BeloteModule {}
