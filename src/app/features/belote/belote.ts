import { firestore } from 'firebase/app';

export interface Belote {
  created: firestore.Timestamp;
  players?: Player[];
  scores: any; // todo score
  turnTo: string;
  chosenColor: BeloteColor;
  isSecondBid;
  hasBeenCut: boolean;
  draw: string[];
}

export type BeloteColor = '♥' | '♦' | '♣' | '♠';

// prettier-ignore
export const cards32 = [
  '7 ♥',   '7 ♦',  '7 ♣',  '7 ♠',
  '8 ♥',   '8 ♦',  '8 ♣',  '8 ♠',
  '9 ♥',   '9 ♦',  '9 ♣',  '9 ♠',
  '10 ♥', '10 ♦', '10 ♣', '10 ♠',
  'J ♥',   'J ♦',  'J ♣',  'J ♠',
  'Q ♥',   'Q ♦',  'Q ♣',  'Q ♠',
  'K ♥',   'K ♦',  'K ♣',  'K ♠',
  'A ♥',   'A ♦',  'A ♣',  'A ♠',
];

export function getRandomDeck(): string[] {
  let [card, remainingCards] = _getRandomCards(cards32);
  const deck = [card];
  while (remainingCards.length) {
    [card, remainingCards] = _getRandomCards(remainingCards);
    deck.push(card);
  }
  return deck;
}

function _getRandomCards(cards: string[]): [string, string[]] {
  if (!cards || !cards.length) {
    return null;
  }
  const drawnCardIndex = Math.floor(Math.random() * cards.length);
  const cardsCopy = [...cards];
  const drawnCard = cardsCopy.splice(drawnCardIndex, 1)[0];
  return [drawnCard, cardsCopy];
}

export interface Player {
  id: string;
  pseudo: string;
  ready: boolean;
  isFirst?: boolean;
  hand: string[];
}
