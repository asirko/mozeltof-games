import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor() {}

  getBeforeEnd(): any {
    return {
      pastTurns: [
        {
          cards: [
            {
              value: 'J ♦',
              pseudo: 'a',
              hasWon: false,
            },
            {
              value: 'A ♦',
              pseudo: 'firefox',
              hasWon: true,
            },
            {
              pseudo: 'z',
              hasWon: false,
              value: '8 ♦',
            },
            {
              value: '7 ♦',
              pseudo: 'Chrome',
              hasWon: false,
            },
          ],
        },
        {
          cards: [
            {
              hasWon: false,
              value: '10 ♣',
              pseudo: 'firefox',
            },
            {
              value: '8 ♣',
              pseudo: 'z',
              hasWon: false,
            },
            {
              pseudo: 'Chrome',
              hasWon: true,
              value: 'J ♣',
            },
            {
              pseudo: 'a',
              hasWon: false,
              value: '7 ♣',
            },
          ],
        },
        {
          cards: [
            {
              pseudo: 'Chrome',
              hasWon: true,
              value: '9 ♣',
            },
            {
              hasWon: false,
              value: 'K ♣',
              pseudo: 'a',
            },
            {
              hasWon: false,
              value: 'Q ♦',
              pseudo: 'firefox',
            },
            {
              value: '9 ♥',
              pseudo: 'z',
              hasWon: false,
            },
          ],
        },
        {
          cards: [
            {
              value: 'A ♥',
              pseudo: 'Chrome',
              hasWon: true,
            },
            {
              hasWon: false,
              value: 'Q ♥',
              pseudo: 'a',
            },
            {
              hasWon: false,
              value: '8 ♥',
              pseudo: 'firefox',
            },
            {
              hasWon: false,
              value: 'K ♥',
              pseudo: 'z',
            },
          ],
        },
        {
          cards: [
            {
              value: 'A ♠',
              pseudo: 'Chrome',
              hasWon: true,
            },
            {
              hasWon: false,
              value: 'J ♠',
              pseudo: 'a',
            },
            {
              hasWon: false,
              value: '9 ♠',
              pseudo: 'firefox',
            },
            {
              pseudo: 'z',
              hasWon: false,
              value: 'Q ♠',
            },
          ],
        },
        {
          cards: [
            {
              value: '10 ♠',
              pseudo: 'Chrome',
              hasWon: false,
            },
            {
              value: 'A ♣',
              pseudo: 'a',
              hasWon: true,
            },
            {
              hasWon: false,
              value: '7 ♠',
              pseudo: 'firefox',
            },
            {
              hasWon: false,
              value: 'K ♠',
              pseudo: 'z',
            },
          ],
        },
        {
          cards: [
            {
              hasWon: false,
              value: '10 ♦',
              pseudo: 'a',
            },
            {
              hasWon: false,
              value: '7 ♥',
              pseudo: 'firefox',
            },
            {
              value: 'K ♦',
              pseudo: 'z',
              hasWon: false,
            },
            {
              hasWon: true,
              value: 'Q ♣',
              pseudo: 'Chrome',
            },
          ],
        },
      ],
      turnTo: 'j0J9UrLS2JiYGGxXtVZX',
      atout: '♣',
      hasBeenCut: false,
      players: [
        {
          ready: true,
          id: 'wCTCSC8cDJ6nFTSdZKQV',
          handWithClues: null,
          isFirst: true,
          playedCard: '9 ♦',
          hand: [],
          pseudo: 'a',
        },
        {
          playedCard: 'J ♥',
          hand: [],
          pseudo: 'firefox',
          ready: true,
          id: 'zHB6WAqrMA2wK7qf4bfW',
          handWithClues: null,
          isFirst: false,
        },
        {
          playedCard: '10 ♥',
          hand: [],
          pseudo: 'z',
          ready: true,
          id: 'j0J9UrLS2JiYGGxXtVZX',
          handWithClues: null,
          isFirst: false,
        },
        {
          handWithClues: null,
          isFirst: false,
          playedCard: '8 ♠',
          hand: [],
          pseudo: 'Chrome',
          ready: true,
          id: 'lhinzb1jv8BvwtTZ2Nyt',
        },
      ],
      whoTook: 'lhinzb1jv8BvwtTZ2Nyt',
      draw: [],
      isSecondBid: false,
      requestedColor: '♠',
    };
  }
}
