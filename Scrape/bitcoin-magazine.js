const scrapeIt = require('scrape-it');

getBitcoinMagazine = () => {
  return new Promise((resolve, reject) => {
    scrapeIt('https://bitcoinmagazine.com/', {
      articles: {
        listItem: '.card-content',
        data: {
          title: {
            selector: '.card-content a .headline',
            convert: x => x.split('\n')[0],
          },
          url: {
            selector: 'a',
            attr: 'href',
            convert: x => 'https://bitcoinmagazine.com' + x,
          },
          source: {
            selector: '.card-content',
            convert: x => 'bitcoinmagazine.com',
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

module.exports = getBitcoinMagazine;
