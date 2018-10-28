import Axios from 'axios';

export async function getSegevLiveData(game, ex_game_id) {
  try {
    const response = await Axios.get(
      `http://basket.co.il/pbp/json_live/${
        game.extensions.ex_game_id
      }_boxscore.json`
    );

    const gameInfo = response.data.result.boxscore.gameInfo;
    const res = {
      ...game,
      extensions: {
        ...game.extensions,
        currentQuarter: gameInfo.currentQuarter,
        currentQuarterTimeMinutes: gameInfo.currentQuarterTime.m,
        home_team_score: gameInfo.homeScore,
        away_team_score: gameInfo.awayScore
      }
    };

    return Promise.resolve(res);
  } catch (e) {
    console.log('error', e);
    return Promise.resolve(game);
  }
}
