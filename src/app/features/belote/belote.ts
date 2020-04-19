import { firestore } from 'firebase/app';

export interface Belote {
  created: firestore.Timestamp;
  players?: Player[];
  scores: BeloteStats; // todo score
  turnTo: string;
  atout: BeloteColor;
  requestedColor: BeloteColor;
  isSecondBid;
  hasBeenCut: boolean;
  whoTook: string;
  draw: string[];
  pastTurns: PastTurn[];
  stats: BeloteStats;
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
  handWithClues?: { value: string; isPlayable }[];
  playedCard?: string;
}

export interface BeloteStats {
  team1: Team;
  team2: Team;
}
export interface Team {
  name: string[];
  id: string[];
  score: number[];
}

export interface PastTurn {
  cards: PastAction[];
}

export interface PastAction {
  value: string;
  pseudo: string;
  hasWon: boolean;
  id: string;
}
