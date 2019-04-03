import axios from 'axios';
import {
  parseXML,
  urlEncode
} from './utils';

export default () => {
  const url = 'https://www.maccabi.co.il/MaccabiServices/MaccabiServices.asmx/GetPlayers';
  return axios.get(url).then(handlePlayersResponse).catch(e => Promise.reject());

};

function handlePlayersResponse(response) {
  const rawData = parseXML(response.data);
  const players = rawData.Players.Player.map(player => parsePlayer(player));
  return {
    id: 'players',
    title: 'שחקנים',
    type: {
      value: 'feed'
    },
    entry: players
  };
}

function parsePlayer(player) {
  return {
    type: {
      value: 'link'
    },
    id: player.ID._text,
    title: player.Name._cdata,
    summary: player.About._cdata || '-',
    author: {
      name: player.Name._cdata
    },
    link: {
      href: urlEncode(`https://maccabi.co.il/playerApp.asp?PlayerID=${player.ID._text}`),
      type: 'link'
    },
    media_group: [{
      type: 'image',
      media_item: [{
        src: player.Pic._text,
        key: 'image_base',
        type: 'image'
      }]
    }]
  };
}