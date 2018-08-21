import axios from 'axios';
import {
    parseDate,
    parseXML,
    sliceWrap,
    compareTimes
} from '../utils';
import {
    mapMatchBox
} from './matchBoxMapper'
import {
    getEuroleagueLivaData
} from './euroleagueLivaData';
import {
    getSegevLiveData
} from './segevLiveData';



export default ({
    c_type = 0,
    num_of_items = 1,
    ex_game_id
}) => {
    const url = 'http://www.maccabi.co.il/MaccabiServices/MaccabiServices.asmx/GetGames';
    const c_types = parseCType(c_type);
    return responseMapper(url, c_types, ex_game_id).then(async res => {
        return await handleResponse(res, c_types, num_of_items);
    }).catch(e => Promise.reject('error connecting to maccabi api'));
};

async function handleResponse(response, c_type, num_of_items, ex_game_id) {
    return {
        "id": c_type.join(", "), // WebService GetEventsTypes
        "title": await getEventTypeById(c_type), // WebService GetEventsTypes
        "type": {
            "value": "match_box"
        },
        "entry": sliceWrap(response, num_of_items, item => item.extensions.status === 1)
    }
}

// map through all c_types and returns sorted combined result
async function responseMapper(url, c_types, ex_game_id) {
    const promises = c_types.map(async c_type => await axios.get(`${url}?game_list=0&c_type=${c_type}`))
    return Promise.all(promises).then(res => {
        let entries = [];
        res.forEach(item => {
            const rawData = parseXML(item.data);
            const parsedData = rawData.Games.Game ? parseData(rawData.Games.Game, ex_game_id, c_types.join(', ')) : [];
            parsedData.forEach(async item => {
                if (true) {
                    const liveItem = await getLiveData(item, ex_game_id);
                    entries.push(liveItem);
                } else
                    entries.push(item)
            })
        })
        return entries.sort(((a, b) => compareTimes(a.extensions.match_date, b.extensions.match_date)));
    })
}


async function getLiveData(game, ex_game_id) {
    switch (game.title) {
        case 'יורוליג':
            return await getEuroleagueLivaData(game, ex_game_id); //@@not implemented
            break;
        case 'ליגת העל':
            return await getSegevLiveData(game, ex_game_id);
            break;
        default:
            return game;
    }
    return game;
}

function parseCType(c_type) {
    return c_type.toString().split(",");
}


function parseData(data, ex_game_id, league_type) {
    return data.map(item => mapMatchBox(item, ex_game_id, league_type));
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