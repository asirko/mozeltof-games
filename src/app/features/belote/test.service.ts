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
              id: 'wCTCSC8cDJ6nFTSdZKQV',
              hasWon: false,
            },
            {
              value: 'A ♦',
              id: 'zHB6WAqrMA2wK7qf4bfW',
              pseudo: 'firefox',
              hasWon: true,
            },
            {
              id: 'j0J9UrLS2JiYGGxXtVZX',
              pseudo: 'z',
              hasWon: false,
              value: '8 ♦',
            },
            {
              value: '7 ♦',
              id: 'lhinzb1jv8BvwtTZ2Nyt',
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
              id: 'zHB6WAqrMA2wK7qf4bfW',
              pseudo: 'firefox',
            },
            {
              value: '8 ♣',
              id: 'j0J9UrLS2JiYGGxXtVZX',
              pseudo: 'z',
              hasWon: false,
            },
            {
              id: 'lhinzb1jv8BvwtTZ2Nyt',
              pseudo: 'Chrome',
              hasWon: true,
              value: 'J ♣',
            },
            {
              pseudo: 'a',
              id: 'wCTCSC8cDJ6nFTSdZKQV',
              hasWon: false,
              value: '7 ♣',
            },
          ],
        },
        {
          cards: [
            {
              id: 'lhinzb1jv8BvwtTZ2Nyt',
              pseudo: 'Chrome',
              hasWon: true,
              value: '9 ♣',
            },
            {
              hasWon: false,
              value: 'K ♣',
              pseudo: 'a',
              id: 'wCTCSC8cDJ6nFTSdZKQV',
            },
            {
              hasWon: false,
              value: 'Q ♦',
              id: 'zHB6WAqrMA2wK7qf4bfW',
              pseudo: 'firefox',
            },
            {
              value: '9 ♥',
              id: 'j0J9UrLS2JiYGGxXtVZX',
              pseudo: 'z',
              hasWon: false,
            },
          ],
        },
        {
          cards: [
            {
              value: 'A ♥',
              id: 'lhinzb1jv8BvwtTZ2Nyt',
              pseudo: 'Chrome',
              hasWon: true,
            },
            {
              hasWon: false,
              value: 'Q ♥',
              pseudo: 'a',
              id: 'wCTCSC8cDJ6nFTSdZKQV',
            },
            {
              hasWon: false,
              value: '8 ♥',
              id: 'zHB6WAqrMA2wK7qf4bfW',
              pseudo: 'firefox',
            },
            {
              hasWon: false,
              value: 'K ♥',
              id: 'j0J9UrLS2JiYGGxXtVZX',
              pseudo: 'z',
            },
          ],
        },
        {
          cards: [
            {
              value: 'A ♠',
              id: 'lhinzb1jv8BvwtTZ2Nyt',
              pseudo: 'Chrome',
              hasWon: true,
            },
            {
              hasWon: false,
              value: 'J ♠',
              pseudo: 'a',
              id: 'wCTCSC8cDJ6nFTSdZKQV',
            },
            {
              hasWon: false,
              value: '9 ♠',
              id: 'zHB6WAqrMA2wK7qf4bfW',
              pseudo: 'firefox',
            },
            {
              id: 'j0J9UrLS2JiYGGxXtVZX',
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
              id: 'lhinzb1jv8BvwtTZ2Nyt',
              pseudo: 'Chrome',
              hasWon: false,
            },
            {
              value: 'A ♣',
              pseudo: 'a',
              id: 'wCTCSC8cDJ6nFTSdZKQV',
              hasWon: true,
            },
            {
              hasWon: false,
              value: '7 ♠',
              id: 'zHB6WAqrMA2wK7qf4bfW',
              pseudo: 'firefox',
            },
            {
              hasWon: false,
              value: 'K ♠',
              id: 'j0J9UrLS2JiYGGxXtVZX',
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
              id: 'wCTCSC8cDJ6nFTSdZKQV',
            },
            {
              hasWon: false,
              value: '7 ♥',
              id: 'zHB6WAqrMA2wK7qf4bfW',
              pseudo: 'firefox',
            },
            {
              value: 'K ♦',
              id: 'j0J9UrLS2JiYGGxXtVZX',
              pseudo: 'z',
              hasWon: false,
            },
            {
              hasWon: true,
              value: 'Q ♣',
              id: 'lhinzb1jv8BvwtTZ2Nyt',
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
      stats: {
        team1: {
          id: ['wCTCSC8cDJ6nFTSdZKQV', 'j0J9UrLS2JiYGGxXtVZX'],
          name: ['a', 'z'],
          score: [],
        },
        team2: {
          id: ['zHB6WAqrMA2wK7qf4bfW', 'lhinzb1jv8BvwtTZ2Nyt'],
          name: ['firefox', 'Chrome'],
          score: [],
        },
      },
    };
  }
}
