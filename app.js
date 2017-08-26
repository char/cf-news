const request = require('request');
const fs = require('fs');

const getCoinDesk = require('./Scrape/coin-desk');
const getCryptoInsider = require('./Scrape/crypto-insider');
const getCryptoCoinsNews = require('./Scrape/crypto-coins-news');

let sourceIterator = 0;

const getSources = () => {
  return new Promise((resolve, reject) => {
    const qs = {
      language: 'en',
    };

    request({url: 'https://newsapi.org/v1/sources', qs: qs}, (err, response, body) => {
      if (err) { console.log(err); return; }

      let sources = [];
      const json = JSON.parse(body);
      let sJSON = json.sources;

      if (sJSON) {
        // push json objects
        sJSON.forEach((val) => {
          const sid = val.id;
          sources.push(sid);
        });
      }

      if (sources) {
        resolve(sources); // fulfilled
      } else {
        reject('Sources is undefined');
      }
    });
  });
}

const getArticles = (source) => {
  return new Promise((resolve, reject) => {
    let rArticles = [];
    const qs = {
      source: source,
      apiKey: '42cdb8679f6849e6b2c544c956adc8a0',
      sortBy: 'top',
    };

    request({url: 'https://newsapi.org/v1/articles', qs: qs}, (err, response, body) => {
      if (err) { console.log(err); return; }

      let articles = [];
      const json = JSON.parse(body);
      let aJSON = json.articles;

      if (aJSON) {
        // push json objects
        aJSON.forEach((val) => {
          articles.push(val);
        });

        // get items that match filter
        articles = articles.filter((a) => {
          let title = a.title;
          return title.toLowerCase().includes('coin');
        });

        if (articles) {
          if (articles.length > 0) {
            sourceIterator += 1;
            resolve(articles);
          }
        } else {
          reject('articles is null or undefined: ' + typeof articles);
        }
      }
    });
  });
}

const writeName = 'articles.json';
// NewsAPI
(async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let rArticles = [];
      const sources = await getSources();

      fs.readFile('./' + writeName, 'utf8', async (err, data) => {
        if (err) { console.error(err); return; }
        await Promise.all(sources.map(async (s) => {
          try {
            let i = 0;
            const articles = await getArticles(s);
            if (articles.length > 0) {
              rArticles.push({articles: articles, source: s});
              i += 1;
            }

            if (i == sourceIterator) {
              if (data) {
                let json = JSON.parse(data);
                json.mainArticles.newsAPI = rArticles;

                fs.writeFile(
                  writeName,
                  JSON.stringify(json, null, 4),
                  (err) => {
                    if (err) {
                      console.error(err);
                    } else {
                      sourceIterator = 0;
                      console.log('NewsAPI JSON saved to', writeName);
                    }
                  }
                );

                return;
              } else {
                const json = {
                  mainArticles: {
                    newsAPI: rArticles,
                  },
                };
                fs.writeFile(
                  writeName,
                  JSON.stringify(json, null, 2),
                  (err) => {
                    if (err) {
                      console.error(err);
                    } else {
                      sourceIterator = 0;
                      console.log('JSON saved to', writeName);
                      resolve();
                    }
                  }
                );
              }
            }
          } catch (error) {
            if (error == 'articles length <= 0') {
              return;
            } else {
              reject(error);
            }
          }
        }));
      });
    } catch (error) {
      reject(error);
    }
  });
  // Wait for NewsAPI to scrape first to avoid overwriting
})().then(() => {
  // Coin Desk
  (async () => {
    try {
      const page = await getCoinDesk();
      fs.readFile('./' + writeName, 'utf8', (err, data) => {
        if (err) { console.error(err); return; }
        if (data) {
          let json = JSON.parse(data);
          json.mainArticles.coinDesk = [page];

          fs.writeFile(
            writeName,
            JSON.stringify(json, null, 2),
            (err) => {
              if (err) {
                console.error(err);
              } else {
                sourceIterator = 0;
                console.log('Coindesk JSON saved to', writeName);
              }
            }
          );
        } else {
          const json = {
            mainArticles: {
              coinDesk: [page],
            },
          };
          fs.writeFile(
            writeName,
            JSON.stringify(json, null, 2),
            (err) => {
              if (err) {
                console.error(err);
              } else {
                sourceIterator = 0;
                console.log('JSON saved to', writeName);
              }
            }
          );
        }
      });
    } catch (error) {

    }
  })();

  // Crypto Insider
  (async () => {
    try {
      const page = await getCryptoInsider();
      fs.readFile('./' + writeName, 'utf8', (err, data) => {
        if (err) { console.error(err); return; }
        if (data) {
          let json = JSON.parse(data);
          json.mainArticles.cryptoInsider = [page];

          fs.writeFile(
            writeName,
            JSON.stringify(json, null, 2),
            (err) => {
              if (err) {
                console.error(err);
              } else {
                sourceIterator = 0;
                console.log('CryptoInsider JSON saved to', writeName);
              }
            }
          );
        } else {
          const json = {
            mainArticles: {
              cryptoInsider: [page],
            },
          };
          fs.writeFile(
            writeName,
            JSON.stringify(json, null, 2),
            (err) => {
              if (err) {
                console.error(err);
              } else {
                sourceIterator = 0;
                console.log('JSON saved to', writeName);
              }
            }
          );
        }
      });
    } catch (error) {

    }
  })();

  // Crypto Coins News
  (async () => {
    try {
      const page = await getCryptoCoinsNews();
      fs.readFile('./' + writeName, 'utf8', (err, data) => {
        if (err) { console.error(err); return; }
        if (data) {
          let json = JSON.parse(data);
          json.mainArticles.cryptoCoinsNews = [page];

          fs.writeFile(
            writeName,
            JSON.stringify(json, null, 2),
            (err) => {
              if (err) {
                console.error(err);
              } else {
                sourceIterator = 0;
                console.log('Crypto Coins News JSON saved to', writeName);
              }
            }
          );
        } else {
          const json = {
            mainArticles: {
              cryptoInsider: [page],
            },
          };
          fs.writeFile(
            writeName,
            JSON.stringify(json, null, 2),
            (err) => {
              if (err) {
                console.error(err);
              } else {
                sourceIterator = 0;
                console.log('JSON saved to', writeName);
              }
            }
          );
        }
      });
    } catch (error) {

    }
  })();
});
