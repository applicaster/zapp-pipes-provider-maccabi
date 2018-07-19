import axios from 'axios';
import { parseXML } from './utils';

export default ({ url }) => {
  if (url) {
    return axios.get(url).then(res => handlePlayersResponse(res));
  }

  return Promise.reject('no url passed');
};

function handlePlayersResponse(response) {
  const rawData = parseXML(response.data);
  const players = rawData.Players.Player.map(player => parsePlayer(player));
  return {
    id: 'players',
    title: 'סגל שחקנים',
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
      href: `http://www.maccabi.co.il/player.asp?PlayerID=${player.ID._text}`,
      type: 'link'
    },
    media_group: [
      {
        type: 'image',
        media_item: [
          {
            src: player.Pic._text,
            key: 'image_base',
            type: 'image'
          }
        ]
      }
    ]
  };
}
