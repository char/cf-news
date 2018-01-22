const scrapeIt = require('scrape-it');

getCryptoInsider = () => {
  return new Promise((resolve, reject) => {
    scrapeIt('https://www.cryptoinsider.com/', {
      articles: {
        listItem: '.post-title',
        data: {
          title: '.post-title a',
          url: {
            selector: 'a',
            attr: 'href',
          },
          source: {
            selector: '.post-title a',
            convert: x => 'cryptoinsider.com',
          },
        },
      },
    }, (err, page) => {
      console.log('yoooo', err);
      if (err) {
        resolve(err);
      } else {
        resolve(page);
      }
    });
  });
}

module.exports = getCryptoInsider;
