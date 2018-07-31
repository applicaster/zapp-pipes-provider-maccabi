import axios from 'axios';
import moment from 'moment';
import {
    parseDate,
    parseXML,
    urlEncode,
    sliceWrap,
    compareTimes
} from './utils';



export default ({
    c_type = 0,
    num_of_items = 1
}) => {
    const url = 'http://www.maccabi.co.il/MaccabiServices/MaccabiServices.asmx/GetGames';
    const c_types = parseCType(c_type);
    return responseMapper(url, c_types).then(async res => {
        return await handleResponse(res, c_types, num_of_items);
    }).catch(e => Promise.reject('error connecting to maccabi api'));



};




async function handleResponse(response, c_type, num_of_items) {
    return {
        "id": c_type.join(", "), // WebService GetEventsTypes
        "title": await getEventTypeById(c_type), // WebService GetEventsTypes
        "type": {
            "value": "match_box"
        },
        "entry": sliceWrap(response, num_of_items, item => item.extensions.status === 1)
    }
}


async function responseMapper(url, c_types) {
    const promises = c_types.map(async c_type => await axios.get(`${url}?game_list=0&c_type=${c_type}`))
    return Promise.all(promises).then(res => {
        let entries = [];
        res.forEach(item => {
            const rawData = parseXML(item.data);
            const parsedData = rawData.Games.Game ? parseData(rawData.Games.Game) : [];
            parsedData.forEach(item => entries.push(item))
        })
        return entries.sort(((a, b) => compareTimes(a.extensions.match_date, b.extensions.match_date)));
    })
}

function parseCType(c_type) {
    return c_type.toString().split(",");
}


function parseData(data) {
    return data.map(parseItem);
}

function parseItem(Game) {
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

function getEventTypeById(c_types) {
    if (c_types.includes('0')) return "כל המשחקים"
    return axios
        .get(
            'http://www.maccabi.co.il/MaccabiServices/MaccabiServices.asmx/GetEventsTypes'
        ).then(response => {
            const rawData = parseXML(response.data);
            const data = rawData.EventsTypes.Item.filter(item => {
                return c_types.includes(item.ID._text)
            })
            return data.map(item => item.Title._text).join(", ")
        })
}