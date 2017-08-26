const request = require('request');
const fs = require('fs');

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
          } else {
            reject('articles length <= 0');
          }
        } else {
          reject('articles is null or undefined: ' + typeof articles);
        }
      }
    });
  });
}


(async () => {
  let rArticles = [];

  try {
    const sources = await getSources();

    console.log('for loop');

    await Promise.all(sources.map(async (s) => {
      let i = 0;
      const articles = await getArticles(s);
      if (articles.length > 0) {
        rArticles.push({articles: articles, source: s});
        console.log('articles length: ' + articles.length);
        i += 1;
      }

      if (i == sourceIterator) {
        const writeName = 'articles.json';
        fs.writeFile(
          writeName,
          JSON.stringify(rArticles, null, 4),
          (err) => {
            if (err) {
              console.error(err);
            } else {
              sourceIterator = 0;
              console.log('JSON saved to', writeName);
            }
          }
        );

        return;
      }
    }));
  } catch (error) {
    console.error(error);
  }
})();
