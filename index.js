const mongoose = require('mongoose');
const axios = require('axios');

mongoose.connect('mongodb://localhost/cache', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected')
});

const schema = new mongoose.Schema({ key: 'string', data: Buffer });
const Cache = mongoose.model('Cache', schema);


class MongooseClient {
  constructor() {
    this.Cache = Cache;
  }

  set(key, age) {
    var cache = new Cache({ key, age })
    cache.save(function (err) {
      if (err) return console.log('something unexpected happened', err)

      console.log('data was saved successfully');
    })
  }

  get(key) {
    return new Promise((resolve, reject) => {
      Cache.find({ key }, (err, res) => {
        if (err) {
          console.log('something unexpected happened', err)
          return reject(err);
        }
        if (res.length === 0) {
          return reject('this record is empty')
        }

        return resolve(res);
      })
    })
  }

}

const mongooseClient = new MongooseClient();

function getData(url) {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await mongooseClient.get(url);
      return resolve(res);
    } catch (e) {
      console.log(e)

      axios(url)
        .then(({ data }) => {
          mongooseClient.set(url, data)
          return resolve(data);
        });
    }
  })

}

getData('https://jsonplaceholder.typicode.com/posts/1')
  .then(res => console.log(res))

// getData('abdoul')
  // .then(res => console.log(res))
