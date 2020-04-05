import { firestore } from 'firebase/app';

export interface Belote {
  created: firestore.Timestamp;
  players?: Player[];
  scores: any; // todo score
  turnTo: string;
  colorChosen: '♥' | '♦' | '♣' | '♠';
  cards: string[];
}

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

export interface Player {
  id: string;
  pseudo: string;
  ready: boolean;
}
