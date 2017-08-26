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

module.exports = getCryptoCoinsNews;
