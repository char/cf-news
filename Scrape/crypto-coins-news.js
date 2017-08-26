const scrapeIt = require('scrape-it');

getCryptoCoinsNews = () => {
  return new Promise((resolve, reject) => {
    scrapeIt('https://www.cryptocoinsnews.com/', {
      articles: {
        listItem: '.entry-title',
        data: {
          title: '.entry-title a',
          url: {
            selector: 'a',
            attr: 'href',
          },
          source: {
            selector: '.entry-title a',
            convert: x => 'cryptocoinsnews.com',
          },
        },
      },
    }, (err, page) => {
      if (err) {
        reject(err);
      } else {
        resolve(page);
      }
    });
  });
}

module.exports = getCryptoCoinsNews;
