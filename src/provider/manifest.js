export const manifest = {
  handlers: ['players', 'news', 'matchBox', 'board'],
  help: {
    players: {
      description: 'retrieves a list of players'
    },
    news: {
      description: 'retrieves a list of news by category',
      params: {
        newsType: 'id of news type to retrieve (defaults to 0: all categories)',
        from: 'index of first news item to retrieve',
        to: 'index of last news item to retrieve'
      }
    },
    matchBox: {
      description: 'retrieves match box data',
      params: {
        c_type: 'id of category of match box to retrieve',
        num_of_items: 'total number of items to retrieve. For example if num_of_items=5 then current match will be returened, prefixed by two previews matches and trailed by two upcoming matches'
      }
    },
    board: {
      description: 'retrieves standings board',
      params: {
        c_type: 'competition id or ids'
      }
    }

  }
};