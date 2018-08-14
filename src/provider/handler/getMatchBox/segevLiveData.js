import Axios from 'axios';

export async function getSegevLiveData(game, external_id) {
    try {
        const response = await Axios.get(`http://basket.co.il/pbp/json_live/${external_id}_boxscore.json`);

        const gameInfo = response.data.result.boxscore.gameInfo;


        return { ...game,
            extensions: {
                ...game.extensions,
                currentQuarter: gameInfo.currentQuarter,
                currentQuarterTimeMinutes: gameInfo.currentQuarterTime.m,
                home_team_score: gameInfo.homeScore,
                away_team_score: gameInfo.awayScore

            }
        }
    } catch (e) {
        console.log(e);
        return game;
    }

}