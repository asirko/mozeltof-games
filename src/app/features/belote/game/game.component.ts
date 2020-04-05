import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  private readonly gameId = this.route.snapshot.params.id;
  game$ = this.angularFirestore
    .collection('games')
    .doc('/' + this.gameId)
    .valueChanges();

  constructor(private angularFirestore: AngularFirestore, private route: ActivatedRoute) {}
}
