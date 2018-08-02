import moment from 'moment';
import {
    urlEncode
} from '../utils'

export function mapMatchBox(Game) {
    return {
        "type": {
            "value": Game.GameStatus._text
        },
        "id": Game.ID._text,
        "title": Game.GameTypeTxt._text,
        "summary": "",
        "author": {
            "name": "maccabi"
        },
        "link": {
            "href": urlEncode(`http://maccabi.co.il/gameZoneApp.asp?gameID=${Game.ID._text}`),
            "type": "link"
        },
        "media_group": [{
            "type": "team1_logo",
            "media_item": [{
                    "src": Game.Team1Logo._text,
                    "key": "image_base",
                    "type": "image"
                },
                {
                    "src": Game.Team2Logo._text,
                    "key": "image_base",
                    "type": "image"
                }
            ]
        }],
        "extensions": {
            //date formatted string with this format "yyyy/MM/dd HH:mm:ss Z". exsample: "2018/06/26 19:45:00 +0000"
            "match_date": moment(`${Game.GameDate._text} ${Game.GameTime._text}`, "DD/MM/YYYY HH:mm").format("YYYY/MM/DD HH:mm:ss Z"), //Date
            "status": Game.GameStatus._text,
            "home_team_name": Game.Team1Name._cdata,
            "home_team_score": Game.Team1Score._text,
            "away_team_name": Game.Team2Name._cdata,
            "away_team_score": Game.Team2Score._text,
            "match_stadium": Game.GamePlace._cdata,
            "match_round": Game.Round._text,
            "match_winner": Game.HomeAway._text,
            "tickets_url": urlEncode(`<static url>?game_id=${Game.ID._text}`),
            "currentQuarter": "",
            "currentQuarterTimeMinutes": ""

        }
    }

}