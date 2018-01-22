const scrapeIt = require('scrape-it');

getCryptoNews = () => {
  return new Promise((resolve, reject) => {
    scrapeIt('https://crypto-news.net/', {
      articles: {
        listItem: '.td-module-thumb',
        data: {
          title: {
            selector: 'a',
            attr: 'title',
          },
          url: {
            selector: 'a',
            attr: 'href',
          },
          source: {
            selector: '.td-module-thumb',
            convert: x => 'crypto-news.net',
          },
        },
      },
    }, (err, page) => {
      if (err) {
        resolve(err);
      } else {
        resolve(page);
      }
    });
  });
}

module.exports = getCryptoNews;
