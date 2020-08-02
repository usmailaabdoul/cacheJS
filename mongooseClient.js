// getting-started.js

class MongooseClient {
  
  set(Cache, key, age) {
    this.Cache = Cache
    console.log('hello')
    var cache = Cache({ key, age }) 
    cache.create(function (e) {
      if (e) return console.log('something unexpected happened', e)
      
      console.log('data was saved successfully');
    })
  }

  get(Cache, key) {

  }

}

const mongooseClient = new MongooseClient();

mongooseClient.set()
module.exports = {
  mongooseClient,
}





