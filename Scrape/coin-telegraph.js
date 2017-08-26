const scrapeIt = require('scrape-it');

getCoinTelegraph = () => {
  return new Promise((resolve, reject) => {
    scrapeIt('https://cointelegraph.com/tags/cryptocurrencies', {
      articles: {
        listItem: '.row',
        data: {
          title: 'lol'
        },
        source: {
          selector: '.row',
          convert: x => 'cointelegraph.com',
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

module.exports = getCoinTelegraph;
