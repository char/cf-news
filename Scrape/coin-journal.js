const scrapeIt = require('scrape-it');

getCoinJournal = () => {
  return new Promise((resolve, reject) => {
    scrapeIt('https://coinjournal.net/', {
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
        page.source = 'coinjournal.net';
        resolve(page);
      }
    });
  });
}

module.exports = getCoinJournal;
