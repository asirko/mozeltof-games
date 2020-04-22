import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Belote } from '../../../belote';
import { environment } from '../../../../../../environments/environment';
import { BeloteService } from '../../../belote.service';
import { PLAYER_ID_KEY } from '../../../../../shared/pseudo/pseudo.guard';
import { MatDialog } from '@angular/material/dialog';
import { TestService } from '../../../test.service';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent {
  @Input() game: Belote;
  @Output() closeDrawer = new EventEmitter();

  readonly isDev = !environment.production;

  private currentPlayerId = localStorage.getItem(PLAYER_ID_KEY);

  constructor(private beloteService: BeloteService, private matDialog: MatDialog, private testService: TestService) {}

  reset() {
    this.beloteService.initGame(this.currentPlayerId).subscribe();
  }

  test() {
    this.beloteService.updateGame(this.testService.getBeforeEnd());
  }
}
