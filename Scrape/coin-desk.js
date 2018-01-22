const scrapeIt = require('scrape-it');

getCoinDesk = () => {
  return new Promise((resolve, reject) => {
    scrapeIt('https://www.coindesk.com/', {
      articles: {
        listItem: '.article-featured',
        data: {
          title: {
            selector: '.article-featured a',
            convert: x => x.split('\n')[0],
          },
          url: {
            selector: 'a',
            attr: 'href',
          },
          source: {
            selector: '.article-featured a',
            convert: x => 'coindesk.com',
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

module.exports = getCoinDesk;
