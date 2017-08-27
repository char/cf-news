const request = require('request');
const fs = require('fs');
const express = require('express');
const app = new express();
const CronJob = require('cron').CronJob;
const cors = require('cors');

const getCoinDesk = require('./Scrape/coin-desk');
const getCryptoInsider = require('./Scrape/crypto-insider');
const getCryptoCoinsNews = require('./Scrape/crypto-coins-news');
const getCoinTelegraph = require('./Scrape/coin-telegraph');
const getCoinJournal = require('./Scrape/coin-journal');
const getCryptoNews = require('./Scrape/crypto-news');
const getEthNews = require('./Scrape/eth-news');

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

const doEverything = () => {
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
                        resolve();
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
    return new Promise(async (resolve, reject) => {
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
                  reject(err);
                } else {
                  sourceIterator = 0;
                  console.log('Coindesk JSON saved to', writeName);
                  resolve();
                }
              }
            );
          }
        });
      } catch (error) {

      }
    }).then(() => {
      // Crypto Insider
      return new Promise(async (resolve, reject) => {
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
                    reject(err);
                  } else {
                    sourceIterator = 0;
                    console.log('CryptoInsider JSON saved to', writeName);
                    resolve(0);
                  }
                }
              );
            }
          });
        } catch (error) {

        }
      }).then(() => {
        return new Promise(async (resolve, reject) => {
          // Crypto Coins News
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
                        reject(err);
                      } else {
                        sourceIterator = 0;
                        console.log('Crypto Coins News JSON saved to', writeName);
                        resolve();
                      }
                    }
                  );
                }
              });
            } catch (error) {

            }
        }).then(() => {
          return new Promise(async (resolve, reject) => {
            // Coin Telegraph
              try {
                const page = await getCoinTelegraph();
                fs.readFile('./' + writeName, 'utf8', (err, data) => {
                  if (err) { console.error(err); return; }
                  if (data) {
                    let json = JSON.parse(data);
                    json.mainArticles.coinTelegraph = [page];

                    fs.writeFile(
                      writeName,
                      JSON.stringify(json, null, 2),
                      (err) => {
                        if (err) {
                          console.error(err);
                          reject(err);
                        } else {
                          sourceIterator = 0;
                          console.log('CoinTelegraph JSON saved to', writeName);
                          resolve();
                        }
                      }
                    );
                  }
                });
              } catch (error) {

              }
          }).then(() => {
            return new Promise(async (resolve, reject) => {
              // Coin Journal
              try {
                const page = await getCoinJournal();
                fs.readFile('./' + writeName, 'utf8', (err, data) => {
                  if (err) { console.error(err); return; }
                  if (data) {
                    let json = JSON.parse(data);
                    json.mainArticles.coinJournal = [page];

                    fs.writeFile(
                      writeName,
                      JSON.stringify(json, null, 2),
                      (err) => {
                        if (err) {
                          console.error(err);
                          reject(err);
                        } else {
                          sourceIterator = 0;
                          console.log('CoinJournal JSON saved to', writeName);
                          resolve();
                        }
                      }
                    );
                  }
                });
              } catch (error) {

              }
            });
          }).then(() => {
            return new Promise(async (resolve, reject) => {
              // Crypto-News
              try {
                const page = await getCryptoNews();
                fs.readFile('./' + writeName, 'utf8', (err, data) => {
                  if (err) { console.error(err); return; }
                  if (data) {
                    let json = JSON.parse(data);
                    json.mainArticles.cryptoNews = [page];

                    fs.writeFile(
                      writeName,
                      JSON.stringify(json, null, 2),
                      (err) => {
                        if (err) {
                          console.error(err);
                          reject(err);
                        } else {
                          sourceIterator = 0;
                          console.log('Crypto-News JSON saved to', writeName);
                          resolve();
                        }
                      }
                    );
                  }
                });
              } catch (error) {

              }
            });
          }).then(() => {
            return new Promise(async (resolve, reject) => {
              // Eth News
              try {
                const page = await getEthNews();
                fs.readFile('./' + writeName, 'utf8', (err, data) => {
                  if (err) { console.error(err); return; }
                  if (data) {
                    let json = JSON.parse(data);
                    console.log(page);
                    json.mainArticles.ethNews = [page];

                    fs.writeFile(
                      writeName,
                      JSON.stringify(json, null, 2),
                      (err) => {
                        if (err) {
                          console.error(err);
                          reject(err);
                        } else {
                          sourceIterator = 0;
                          console.log('EthNews JSON saved to', writeName);
                          resolve();
                        }
                      }
                    );
                  }
                });
              } catch (error) {

              }
            });
          }).then(() => {
              console.log('[' + new Date().toUTCString() + ']');
              fs.readFile('./' + writeName, 'utf8', (err, data) => {
                if (err) { console.log(err); return; }
                if (data) {
                  let displayArticles = [];
                  let json = JSON.parse(data);
                  const main = json.mainArticles;
                  Object.keys(main).forEach((key) => {
                    if (key == 'newsAPI') { return; }
                    const keyA = main[key][0].articles;
                    if (keyA) {
                      for (let i=0; i<keyA.length; i++) {
                        if (i == 8) {
                          break;
                        } else {
                          if (keyA[i].title !== '') {
                            displayArticles.push(keyA[i]);
                          }
                        }
                      }
                    }
                  });

                  function shuffleArray(array) {
                    for (var i = array.length - 1; i > 0; i--) {
                      var j = Math.floor(Math.random() * (i + 1));
                      var temp = array[i];
                      array[i] = array[j];
                      array[j] = temp;
                    }

                    return array;
                  }

                  displayArticles = shuffleArray(displayArticles).slice(0, 25);
                  console.log(displayArticles.length);
                  const write = 'display-articles.json';
                  fs.writeFile(
                    write,
                    JSON.stringify(displayArticles, null, 2),
                    (err) => {
                      if (err) {
                        console.error(err);
                      } else {
                        sourceIterator = 0;
                        console.log('Saved top 25 to', write);
                      }
                    }
                  );
                }
              });
          });
        });
      });
    });
  });
}

app.use(cors());

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  fs.readFile('./' + 'display-articles.json', 'utf8', (err, data) => {
    if (err) { console.error(error); return; }
    if (data) {
      const json = JSON.parse(data);
      return res.json(json);
    }
  });
});

const port = 6501;
app.listen(port);
console.log('[' + new Date().toUTCString() + '] listening on port:', port);

const job = new CronJob('0 0 5 * * *', () => {
  console.log('time ran');
  doEverything();
}, () => {
  console.log('job stopped');
},
  false,
  'America/Los_Angeles'
);
job.start();
