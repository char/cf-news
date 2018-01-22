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
          source: {
            selector: '.entry-title',
            convert: x => 'coinjournal.net',
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

module.exports = getCoinJournal;
