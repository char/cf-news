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
        },
      },
    }, (err, page) => {
      if (err) {
        reject(err);
      } else {
        page.source = 'cryptoinsider.com';
        resolve(page);
      }
    });
  });
}

module.exports = getCryptoInsider;
