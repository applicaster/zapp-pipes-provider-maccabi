export const manifest = {
  handlers: ['players', 'news'],
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
    }
  }
};