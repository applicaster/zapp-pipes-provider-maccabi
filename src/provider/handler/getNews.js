import axios from 'axios';
import { parseDate, parseXML } from './utils';

export default ({ url, from, to, newsType = 0 }) => {
  if (url) {
    return axios.get(`${url}?item_id=0&c_type=${newsType || 0}`).then(res => {
      const parsedResults = handlePlayersResponse(res, newsType, from, to);
      return parsedResults;
    });
  }

  return Promise.reject('no url passed');
};

async function handlePlayersResponse(response, newsType, from, to) {
  const rawData = parseXML(response.data);
  const parsedNews = parseNews(rawData.News.Item);
  const newsTypeTitle = await getNewsTitleById(newsType);
  return {
    id: newsType,
    title: newsTypeTitle,
    type: {
      value: 'feed'
    },
    entry: parsedNews.slice(from ? from - 1 : 0, to || parsedNews.length)
  };
}

function parseNews(news) {
  return news.map(item => parseItem(item));
}

function parseItem(item) {
  console.log(item.MobilePic);
  return {
    type: {
      value: 'link'
    },
    updated: parseDate(item.NewsDate._cdata, 'DD/MM/YYYY'), //should follow ISO8601 date format.
    id: item.ID._text, //String
    title: item.Title._cdata,
    summary: item.Abstract._cdata,
    author: {
      name: '' //String
    },
    link: {
      href: item.Link
        ? item.Link._text
        : `http://www.maccabi.co.il/news.asp?id=${item.ID._text}`,
      type: 'link'
    },
    media_group: [
      {
        type: 'image',
        media_item: [
          {
            src: item.MobilePic ? item.MobilePic._text || '' : '',
            key: 'image_base',
            type: 'image'
          }
        ]
      }
    ]
  };
}

function getNewsTitleById(id) {
  try {
    return axios
      .get(
        'http://www.maccabi.co.il/MaccabiServices/MaccabiServices.asmx/GetNewsTypes'
      )
      .then(res => {
        const rawData = parseXML(res.data);
        return Promise.resolve(
          rawData.NewsTypes.Item.find(item => item.ID._text == id).Title._text
        );
      });
  } catch (e) {
    Promise.reject('error');
  }
}
