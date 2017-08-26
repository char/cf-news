const scrapeIt = require('scrape-it');

getCoinTelegraph = () => {
  return new Promise((resolve, reject) => {
    scrapeIt('https://cointelegraph.com/tags/cryptocurrencies', {
      articles: {
        listItem: '.row',
        data: {
          title: 'lol'
        },
      },
    }, (err, page) => {
      if (err) {
        reject(err);
      } else {
        console.log('TELEGPRAH: ');
        console.log(page);
        page.source = 'cointelegraph.com';
        resolve(page);
      }
    });
  });
}

module.exports = getCoinTelegraph;
