import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameListComponent {
  private readonly gameCollection = this.angularFirestore.collection('games');
  list$ = this.gameCollection.valueChanges({ idField: 'id' });

  constructor(private angularFirestore: AngularFirestore) {}

  createGame() {
    this.gameCollection.add({ created: new Date() });
  }

  delete(id: string) {
    this.gameCollection.doc(id).delete();
  }
}
