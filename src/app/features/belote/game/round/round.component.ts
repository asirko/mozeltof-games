import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { BeloteService } from '../../belote.service';
import { map, tap } from 'rxjs/operators';
import { PLAYER_ID_KEY } from '../../../../shared/pseudo/pseudo.guard';
import { Belote, BeloteColor, Player } from '../../belote';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DistributeComponent } from './modals/distribute.component';
import { FirstBidComponent } from './modals/first-bid.component';
import { SecondBidComponent } from './modals/second-bid.component';

const currentPlayerId = localStorage.getItem(PLAYER_ID_KEY);

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundComponent implements OnDestroy {
  private dialogDistributionSub: Subscription;
  private dialogFirstBidSub: Subscription;

  readonly positions = ['bottom', 'left', 'top', 'right'];

  game$: Observable<Belote> = this.beloteService.fireGame.valueChanges().pipe(
    map(game => {
      console.log(game);
      const currentPlayerIndex = game.players.findIndex(p => p.id === currentPlayerId);
      const players = game.players.map((p, i, list) => list[(i + currentPlayerIndex) % 4]);
      return { ...game, players } as Belote;
    }),
    tap(game => this.manageDistribution(game)),
    tap(game => this.manageBid(game)),
    tap(game => this.manageSecondDistribution(game)),
  );

  constructor(private beloteService: BeloteService, private matDialog: MatDialog) {}

  ngOnDestroy(): void {
    this.dialogDistributionSub?.unsubscribe();
    this.dialogFirstBidSub?.unsubscribe();
  }

  private manageDistribution(game: Belote) {
    // todo before to distribute cards it need to cut the deck
    const modalOpened = this.dialogDistributionSub && !this.dialogDistributionSub.closed;
    if (game.turnTo === currentPlayerId && game.draw.length === 32 && !modalOpened) {
      this.dialogDistributionSub = this.matDialog
        .open(DistributeComponent, { width: '250px', disableClose: true })
        .afterClosed()
        .subscribe((distribution: [number, number]) => {
          const draw = [...game.draw];
          const players: Player[] = game.players.map(p => ({ ...p, hand: [] }));
          const playersIndexOrder = [1, 2, 3, 0];
          distribution.forEach(nbCards => {
            playersIndexOrder.forEach(pIndex => {
              const cardToGive = draw.splice(0, nbCards);
              players[pIndex].hand.push(...cardToGive);
              players[pIndex].isFirst = pIndex === 1;
            });
          });
          this.beloteService.updateGame({ draw, players, turnTo: players[1].id, isSecondBid: false });
        });
    }
  }

  private manageBid(game: Belote) {
    const modalOpened = this.dialogFirstBidSub && !this.dialogFirstBidSub.closed;
    if (game.draw.length === 12 && game.turnTo === currentPlayerId && !modalOpened) {
      console.log(game.isSecondBid);
      const bidComponent = game.isSecondBid ? SecondBidComponent : FirstBidComponent;
      const firstColor = game.draw[0][game.draw[0].length - 1] as BeloteColor;
      this.dialogFirstBidSub = this.matDialog
        .open(bidComponent, { width: '250px', disableClose: true, data: firstColor })
        .afterClosed()
        .subscribe(chosenColor => {
          if (chosenColor) {
            const [firstCard, ...draw] = game.draw;
            const players: Player[] = game.players.map(p => ({ ...p, hand: [...p.hand] }));
            players[0].hand.push(firstCard);
            this.beloteService.updateGame({ draw, players, chosenColor });
          } else {
            const nextPlayer = game.players[1];
            if (game.isSecondBid && nextPlayer.isFirst) {
              this.noOneTookIt(game);
              return;
            }
            const isSecondBid = game.isSecondBid || nextPlayer.isFirst;
            this.beloteService.updateGame({ turnTo: nextPlayer.id, isSecondBid });
          }
        });
    }
  }

  private noOneTookIt(game: Belote) {
    const draw = [...game.draw];
    const players: Player[] = game.players.map(p => {
      draw.push(...p.hand);
      return { ...p, hand: [] };
    });
    const turnTo = players.find(p => p.isFirst).id;
    this.beloteService.updateGame({ draw, players, hasBeenCut: false, turnTo });
  }

  private manageSecondDistribution(game: Belote) {
    if (game.draw.length === 11 && game.players[0].isFirst) {
      const draw = [...game.draw];
      const players: Player[] = game.players.map(p => ({ ...p, hand: [...p.hand] }));
      players.forEach(p => {
        const nbCardsToGive = p.hand.length === 5 ? 3 : 2;
        const cardsToGive = draw.splice(0, nbCardsToGive);
        p.hand.push(...cardsToGive);
      });
      this.beloteService.updateGame({ draw, players, turnTo: players.find(p => p.isFirst).id });
    }
  }
}
