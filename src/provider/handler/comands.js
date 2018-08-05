import getPlayers from './getPlayers';
import getNews from './getNews';
import getMatchBox from './getMatchbox';
import getBoard from './getBoard';

export const commands = {
  players: getPlayers,
  news: getNews,
  matchBox: getMatchBox,
  board: getBoard
};