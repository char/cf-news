const scrapeIt = require('scrape-it');

getEthNews = () => {
  return new Promise((resolve, reject) => {
    scrapeIt('https://crypto-news.net/', {
      articles: {
        listItem: '.article__thumbnail__info',
        data: {
          title: '.article__thumbnail__info h4 a',
          url: {
            selector: '.article__thumbnail__info h4 a',
            attr: 'href',
          },
          source: {
            selector: '.article__thumbnail__info',
            convert: x => 'ethnews.com',
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

module.exports = getEthNews;
