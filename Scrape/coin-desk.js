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
        },
      },
    }, (err, page) => {
      if (err) {
        reject(err);
      } else {
        page.source = 'coindesk.com';
        resolve(page);
      }
    });
  });
}

module.exports = getCoinDesk;
