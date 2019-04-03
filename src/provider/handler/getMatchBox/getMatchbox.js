import axios from 'axios';
import { parseDate, parseXML, sliceWrap, compareTimes } from '../utils';
import { mapMatchBox } from './matchBoxMapper';
import { getEuroleagueLivaData } from './euroleagueLivaData';
import { getSegevLiveData } from './segevLiveData';
import { flatten } from 'lodash';

export default ({
  c_type = '0',
  num_of_items = '0',
  game_list = '0',
  ex_game_id
}) => {
  const url =
    'https://www.maccabi.co.il/MaccabiServices/MaccabiServices.asmx/GetGames';
  const c_types = parseCType(c_type);
  return responseMapper(url, c_types, ex_game_id, game_list)
    .then(async res => {
      return await handleResponse(res, c_types, num_of_items, game_list);
    })
    .catch(e => Promise.reject('error connecting to maccabi api'));
};

async function handleResponse(response, c_type, num_of_items, game_list) {
  return {
    id: c_type.join(', '), // WebService GetEventsTypes
    title: await getEventTypeById(c_type), // WebService GetEventsTypes
    type: {
      value: 'match_box'
    },
    entry:
      num_of_items === '0'
        ? response.filter(item => item.extensions.status == 3)
        : game_list === '0'
          ? getGameList(response, num_of_items)
          : response.slice(0, num_of_items)
  };
}

function getGameList(games, num_of_items) {
  const _finishedGames = games.filter(item => item.extensions.status == 1);
  const liveGames = games.filter(item => item.extensions.status == 3);
  const _unfinishedGames = games.filter(item => item.extensions.status == 2);
  const finishedGames = _finishedGames.slice(
    _finishedGames.length - 2,
    _finishedGames.length
  );
  const unfinishedGames = _unfinishedGames.slice(
    0,
    num_of_items - finishedGames.length - liveGames.length
  );
  return [...finishedGames, ...liveGames, ...unfinishedGames];
}

// map through all c_types and returns sorted combined result
async function responseMapper(url, c_types, ex_game_id, game_list) {
  const promises = c_types.map(
    async c_type =>
      await axios.get(`${url}?game_list=${game_list}&c_type=${c_type}`)
  );

  const response = await Promise.all(promises);

  const b = flatten(
    await Promise.all(
      response.map(async item => {
        const rawData = parseXML(item.data);
        const parsedData = rawData.Games.Game
          ? parseData(rawData.Games.Game, ex_game_id, c_types.join(', '))
          : [];
        const a = parsedData.map(async item => {
          if (item.extensions.status === '3') {
            const liveItem = await getLiveData(item, ex_game_id);
            return liveItem;
          } else return item;
        });
        return await Promise.all(a);
      })
    )
  );

  return b;
}

async function getLiveData(game, ex_game_id) {
  switch (game.title) {
    case 'יורוליג':
      return await getEuroleagueLivaData(game, ex_game_id); //@@not implemented
      break;
    case 'ליגת ווינר-סל':
      return await getSegevLiveData(game, ex_game_id);
      break;
    default:
      return game;
  }
}

function parseCType(c_type) {
  return c_type.toString().split(',');
}

function parseData(data, ex_game_id, league_type) {
  return data.map(item => mapMatchBox(item, ex_game_id, league_type));
}

function getEventTypeById(c_types) {
  if (c_types.includes('0')) return 'כל המשחקים';
  return axios
    .get(
      'https://www.maccabi.co.il/MaccabiServices/MaccabiServices.asmx/GetEventsTypes'
    )
    .then(response => {
      const rawData = parseXML(response.data);
      const data = rawData.EventsTypes.Item.filter(item => {
        return c_types.includes(item.ID._text);
      });
      return data.map(item => item.Title._text).join(', ');
    });
}
