import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { BeloteService } from '../../belote.service';
import { map, tap } from 'rxjs/operators';
import { PLAYER_ID_KEY } from '../../../../shared/pseudo/pseudo.guard';
import { Belote, BeloteColor, PastTurn, Player } from '../../belote';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DistributeComponent } from './modals/distribute.component';
import { FirstBidComponent } from './modals/first-bid.component';
import { SecondBidComponent } from './modals/second-bid.component';
import { CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from '../../../../../environments/environment';
import { LastTurnComponent } from './modals/last-turn.component';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundComponent implements OnDestroy {
  private dialogDistributionSub: Subscription;
  private dialogFirstBidSub: Subscription;
  private currentPlayerId = localStorage.getItem(PLAYER_ID_KEY);
  readonly isDev = !environment.production;

  readonly positions = ['bottom', 'left', 'top', 'right'];

  game$: Observable<Belote> = this.beloteService.fireGame.valueChanges().pipe(
    tap(game => this.initGame(game)),
    map(game => this.reorderForDisplay(game)),
    map(game => this.addHandWithClues(game)),
    tap(game => this.manageDistribution(game)),
    tap(game => this.manageBid(game)),
    tap(game => this.manageSecondDistribution(game)),
  );

  @ViewChild('playMat', { read: CdkDropList }) playMatElement: CdkDropList;

  constructor(private beloteService: BeloteService, private matDialog: MatDialog) {}

  ngOnDestroy(): void {
    this.dialogDistributionSub?.unsubscribe();
    this.dialogFirstBidSub?.unsubscribe();
  }

  private initGame(game: Belote) {
    const noCards = !game.draw?.length && !game.players.some(p => p.hand?.length > 0);
    if (noCards && game.players[0].id === this.currentPlayerId) {
      console.info('init game', this.currentPlayerId);
      this.beloteService.initGame(this.currentPlayerId).subscribe();
    }
  }

  private reorderForDisplay(game: Belote): Belote {
    if (!game.turnTo) {
      return game;
    }
    // reorder players to have the current player first
    const currentPlayerIndex = game.players.findIndex(p => p.id === this.currentPlayerId);
    const players = game.players.map((p, i, list) => list[(i + currentPlayerIndex) % 4]);
    return { ...game, players } as Belote;
  }

  private addHandWithClues(game: Belote): Belote {
    const players: Player[] = game.players.map(p => ({ ...p, hand: [...p.hand], handWithClues: null }));
    const currentPlayer = players.find(p => p.id === game.turnTo);
    if (!game.turnTo || game?.draw.length || game.turnTo !== this.currentPlayerId || currentPlayer.playedCard) {
      return game;
    }

    const playedCards = players.map(p => p.playedCard);
    const playableCards = this.beloteService.getPlayableCards(playedCards, currentPlayer.hand, game.atout, game.requestedColor);
    currentPlayer.handWithClues = currentPlayer.hand.map(c => ({
      value: c,
      isPlayable: playableCards.includes(c),
    }));

    return { ...game, players } as Belote;
  }

  private manageDistribution(game: Belote) {
    // todo before to distribute cards it need to cut the deck
    const modalOpened = this.dialogDistributionSub && !this.dialogDistributionSub.closed;
    if (game.turnTo === this.currentPlayerId && game.draw.length === 32 && !modalOpened) {
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
    if (game.draw?.length === 12 && game.turnTo === this.currentPlayerId && !modalOpened) {
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
            this.beloteService.updateGame({ draw, players, atout: chosenColor, whoTook: players[0].id });
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
    if (game.draw?.length === 11 && game.players[0].isFirst) {
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

  drop(event: CdkDragDrop<string, any>, game: Belote) {
    const players: Player[] = game.players.map(p => ({ ...p, hand: [...p.hand] }));
    const currentPlayer = players.find(p => p.id === this.currentPlayerId);
    if (event.previousContainer === event.container) {
      // reorder its own game
      moveItemInArray(players[0].hand, event.previousIndex, event.currentIndex);
      moveItemInArray(game.players[0].hand, event.previousIndex, event.currentIndex);
      this.beloteService.updateGame({ players });
    } else if (event.container === this.playMatElement && game.turnTo === this.currentPlayerId && !currentPlayer.playedCard) {
      // checked first if the card is playable
      if (currentPlayer.handWithClues[event.previousIndex].isPlayable) {
        currentPlayer.playedCard = currentPlayer.hand.splice(event.previousIndex, 1)[0];
        currentPlayer.handWithClues = null;
        const isFirstCardPlayed = players.every(p => !p.playedCard);
        const requestedColor = isFirstCardPlayed ? (currentPlayer.playedCard.split(' ')[1] as BeloteColor) : game.requestedColor;
        this.beloteService.updateGame({ players, turnTo: !players[1].playedCard ? players[1].id : players[0].id, requestedColor });
      }
    }
  }

  reset() {
    this.beloteService.initGame(this.currentPlayerId).subscribe();
  }

  getPlayedCards(game: Belote): { value: string; rank: number; position: string; isBest: boolean }[] {
    if (game.players.every(p => !p.playedCard)) {
      return null;
    }
    const currentPlayerIndex = game.players.findIndex(p => p.id === game.turnTo);
    const bestCardIndex = this.beloteService.getBestCardIndex(
      game.players.map(p => p.playedCard),
      game.requestedColor,
      game.atout,
    );
    return game.players
      .map((p, i) => ({
        value: p.playedCard,
        rank: currentPlayerIndex >= i ? 4 - (currentPlayerIndex - i) : i - currentPlayerIndex,
        position: this.positions[i],
        isBest: i === bestCardIndex,
      }))
      .filter(pc => pc.value);
  }

  takePlayedCards(game: Belote) {
    const players: Player[] = game.players.map(p => ({ ...p, hand: [...p.hand] }));
    const playedCards = players.map(p => {
      const playedCard = p.playedCard;
      p.playedCard = null;
      return playedCard;
    });
    const pastTurns: PastTurn[] = [...game.pastTurns, { cards: playedCards, winnerId: this.currentPlayerId }];
    this.beloteService.updateGame({ players, pastTurns, turnTo: this.currentPlayerId });
  }

  seeLastTurn(game: Belote) {
    this.matDialog.open(LastTurnComponent, { width: '250px', data: game.pastTurns[game.pastTurns.length - 1] });
  }
}
