const scrapeIt = require('scrape-it');

// listItem, titleOptions, urlOptions, source
const createScrapeOptions = (options) => {
  const { url, listItem, titleOptions, urlOptions, source } = options;
  return {
    url,
    listItem,
    data: {
      title: titleOptions,
      url: urlOptions,
      source: {
        selector: listItem,
        convert: x => source
      }
    }
  }
}

const cointia = createScrapeOptions({
  url: 'https://cointia.com/',
  listItem: 'article.article',
  titleOptions: {
    selector: 'a',
    attr: 'title',
  },
  urlOptions: {
    selector: 'a',
    attr: 'href',
  },
  source: 'cointia.com'
});

const cryptoNews = createScrapeOptions({
  url: 'https://crypto-news.net/',
  listItem: '.td-module-thumb',
  titleOptions: {
    selector: 'a',
    attr: 'title',
  },
  urlOptions: {
    selector: 'a',
    attr: 'href',
  },
  source: 'crypto-news.net',
});

const cryptoCoinsNews = createScrapeOptions({
  url: 'https://www.cryptocoinsnews.com/',
  listItem: '.entry-title',
  titleOptions: '.entry-title a',
  urlOptions: {
    selector: 'a',
    attr: 'href',
  },
  source: 'cryptocoinsnews.com',
});

const coinJournal = createScrapeOptions({
  url: 'https://coinjournal.net/',
  listItem: '.entry-title',
  titleOptions: '.entry-title a',
  urlOptions: {
    selector: 'a',
    attr: 'href',
  },
  source: 'coinjournal.net',
});

const coinDesk = createScrapeOptions({
  url: 'https://www.coindesk.com/',
  listItem: '.article-featured',
  titleOptions: {
    selector: '.article-featured a',
    convert: x => x.split('\n')[0],
  },
  urlOptions: {
    selector: 'a',
    attr: 'href',
  },
  source: 'coindesk.com',
});

const ethNews = createScrapeOptions({
  url: 'https://www.ethnews.com/',
  listItem: '.article-thumbnail',
  titleOptions: '.article-thumbnail .article-thumbnail__info h2',
  urlOptions: {
    selector: '.article-thumbnail .article-thumbnail__info h2 a',
    attr: 'href',
  },
  source: 'ethnews.com',
});

const cryptoInsider = createScrapeOptions({
  url: 'https://www.cryptoinsider.com/',
  listItem: '.post-title',
  titleOptions: '.post-title a',
  urlOptions: {
    selector: 'a',
    attr: 'href',
  },
  source: 'cryptoinsider.com'
});

const bitcoinMagazine = createScrapeOptions({
  url: 'https://bitcoinmagazine.com/',
  listItem: '.card-content',
  titleOptions: {
    selector: '.card-content a .headline',
    convert: x => x.split('\n')[0],
  },
  urlOptions: {
    selector: 'a',
    attr: 'href',
    convert: x => 'https://bitcoinmagazine.com' + x,
  },
  source: 'bitcoinmagazine.com'
});

const sites = {
  cryptoNews,
  cryptoInsider,
  cryptoCoinsNews,
  coinJournal,
  coinDesk,
  ethNews,
  bitcoinMagazine,
  cointia
};

module.exports.scrapeIt = (site) => {
  return new Promise((resolve, reject) => {
    const { url, listItem, data } = sites[site];
    scrapeIt(url, {
      articles: {
        listItem,
        data
      }
    }, (err, page) => {
      if (err) {
        resolve(err);
      } else resolve(page);
    });
  });
};