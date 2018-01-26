const request = require('request');
const fs = require('fs');
const express = require('express');
const app = new express();
const CronJob = require('cron').CronJob;
const cors = require('cors');
const scrape = require('./scrape');

let sourceIterator = 0;
const WRITE_NAME = 'articles.json';

const shuffleArray = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

const saveToFile = (site) => {
  console.log('Saving', site, 'to file...');
  return new Promise(async (resolve, reject) => {
      try {
        const { scrapeIt, sites } = scrape;
        const page = await scrapeIt(site);
        fs.readFile('./' + WRITE_NAME, 'utf8', (err, data) => {
          if (err) throw err;
          if (data) {
            let json = JSON.parse(data);
            json.mainArticles[site] = [page];

            fs.writeFile(
              WRITE_NAME,
              JSON.stringify(json, null, 2),
              (err) => {
                if (err) {
                  throw err;
                } else {
                  sourceIterator = 0;
                  console.log(site, 'JSON saved to', WRITE_NAME);
                  resolve(true);
                }
              }
            );
          }
        });
      } catch (error) {
        console.log(error);
        resolve(false, error);
      }
  })
}

const getSources = () => {
  return new Promise((resolve, reject) => {
    const qs = {
      language: 'en',
    };

    request({url: 'https://newsapi.org/v1/sources', qs: qs}, (err, response, body) => {
      if (err) resolve(console.log(err));

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
      source,
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

const doEverything = async () => {
  // NewsAPI
  try {
    let rArticles = [];
    const sources = await getSources();
    await new Promise((resolve, reject) => {
      fs.readFile('./'+WRITE_NAME, 'utf8', (err, data) => {
        if (err) throw err;
        sources.forEach(async (s) => {
          try {
            let i = 0;
            const articles = await getArticles(s);
            if (articles.length > 0) {
              rArticles.push({articles, source: s});
              i += 1;
            }

            if (i === sourceIterator) {
              if (data) {
                let json = JSON.parse(data);
                json.mainArticles.newsAPI = rArticles;

                fs.writeFile(
                  WRITE_NAME,
                  JSON.stringify(json, null, 4),
                  (err) => {
                    if (err) {
                      console.error(err);
                    } else {
                      sourceIterator = 0;
                      resolve(true);
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
                  WRITE_NAME,
                  JSON.stringify(json, null, 2),
                  (err) => {
                    if (err) {
                      console.error(err);
                    } else {
                      sourceIterator = 0;
                      resolve(true);
                    }
                  }
                );
              }
            }
          } catch (error) {
            reject(false, error);
          }
        });
      });
    });

    await saveToFile('cryptoNews');
    await saveToFile('cryptoInsider');
    await saveToFile('cryptoCoinsNews');
    await saveToFile('coinJournal');
    await saveToFile('coinDesk');
    await saveToFile('ethNews');
    await saveToFile('bitcoinMagazine');

    console.log('[' + new Date().toUTCString() + ']');
    fs.readFile('./' + WRITE_NAME, 'utf8', (err, data) => {
      if (err) { console.log(err); return; }
      if (data) {
        let displayArticles = [];
        let urls = [];
        let json = JSON.parse(data);
        const main = json.mainArticles;
        Object.keys(main).forEach((key) => {
          if (key == 'newsAPI') { return; }
          const keyA = main[key][0].articles;
          if (keyA) {
            for (let i=0; i<keyA.length; i++) {
              if (i == 5) {
                break;
              } else {
                if (keyA[i].title !== '' && urls.indexOf(keyA[i].url) < 0) {
                  displayArticles.push(keyA[i]);
                  urls.push(keyA[i].url);
                }
              }
            }
          }
        });

        displayArticles = shuffleArray(displayArticles).slice(0, 25);
        console.log('Set', displayArticles.length, 'display articles.');
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
  } catch (error) {
    console.log(error);
  }
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

const port = process.env.PORT || 6501;
app.listen(port);
console.log('[' + new Date().toUTCString() + '] listening on port:', port);

const job = new CronJob('0 0 5 * * *', () => {
  console.log('It is 5am. Getting articles...');
  doEverything();
}, () => {
  console.log('job stopped');
},
  false,
  'America/Los_Angeles'
);
//job.start();
doEverything();
