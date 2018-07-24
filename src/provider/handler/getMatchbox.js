import axios from 'axios';
import moment from 'moment';
import {
    parseDate,
    parseXML,
    urlEncode,
    sliceWrap
} from './utils';



export default ({
    c_type = 0,
    num_of_items = 1
}) => {
    const url = 'http://www.maccabi.co.il/MaccabiServices/MaccabiServices.asmx/GetGames'
    return axios.get(`${url}?game_list=0&c_type=${c_type}`).then(res => {
        return handleResponse(res, c_type, num_of_items);
    }).catch(e => Promise.reject('error connecting to maccabi api'));



};

async function handleResponse(response, c_type, num_of_items) {
    const rawData = parseXML(response.data)
    const parsedData = parseData(rawData.Games.Game);


    return {
        "id": c_type, // WebService GetEventsTypes
        "title": getEventTypeById(c_type), // WebService GetEventsTypes
        "type": {
            "value": "match_box"
        },
        "entry": sliceWrap(parsedData, num_of_items, item => item.extensions.status === 1)
    }
}

function parseData(data) {
    return data.map(parseItem);
}

function parseItem(Game) {
    console.log(Game);
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
        "link": [{
            "href": urlEncode(`http://maccabi.co.il/gameZoneApp.asp?gameID=${Game.ID._text}&cYear=2018`),
            "type": "link"
        }],
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
            "tickets_url": `<static url>?game_id=${Game.ID._text}`,
            "currentQuarter": "",
            "currentQuarterTimeMinutes": ""

        }
    }

}

function getEventTypeById(id) {
    if (id == "0") return "כל המשחקים"
    try {
        return axios
            .get(
                'http://www.maccabi.co.il/MaccabiServices/MaccabiServices.asmx/GetEventsTypes'
            )
            .then(res => {
                const rawData = parseXML(res.data);
                console.log(rawData.EventsTypes.Item);
                return Promise.resolve(
                    rawData.EventsTypes.Item.find(item => item.ID._text == id).Title._text
                );
            });
    } catch (e) {
        Promise.reject('error');
    }
}