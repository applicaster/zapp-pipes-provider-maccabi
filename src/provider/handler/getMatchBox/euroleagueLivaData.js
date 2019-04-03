import axios from 'axios';
import { parseXML } from '../utils';

const USER = 'maccabi';
const PASSWORD = 'C547D7E5817A28D55DAA5AF1477DC1FA8ABC0CE3';
export async function getEuroleagueLivaData(game, ex_game_id) {
  try {
    let games_response = await axios.get(
      `https://live.euroleague.net/service.ashx?method=gamesxml&user=${USER}&password=${PASSWORD}`
    );

    if (!parseXML(games_response.data).games)
      games_response = await axios.get(
        `https://live.euroleague.net/service.ashx?method=gamesxml&user=${USER}&password=${PASSWORD}`
      );
    const parsedGame = parseXML(games_response.data).games.game.find(
      item =>
        item.team1._cdata.toLowerCase().includes('maccabi') ||
        item.team2._cdata.toLowerCase().includes('maccabi')
    );

    return Promise.resolve({
      ...game,
      extensions: {
        ...game.extensions,

        currentQuarter:
          Math.ceil(parsedGame.minute._text.split(':')[0] / 10) <= 4
            ? Math.ceil(parsedGame.minute._text.split(':')[0] / 10)
            : 'OT',
        currentQuarterTimeMinutes: parsedGame.minute._text.split(':')[0] % 10,
        home_team_score: parsedGame.homepts._text,
        away_team_score: parsedGame.awaypts._text
      }
    });
  } catch (e) {
    return Promise.resolve(game);
  }
}
