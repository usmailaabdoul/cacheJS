var https = require('https');
const Base64 = require('js-base64').Base64;
var fs = require('fs')
// LRU : least recently used

class CacheStore {
  constructor() {
    this.cacheStorage = [
      { key: 'homePage', LRU: 2, data: { extension: 'html', value: 'https://www.npmjs.com/package/js-base64' } },
      { key: 'profileImage', LRU: 3, data: { extension: 'png', value: 'profile.png' } },
      { key: 'homeImage', LRU: 1, data: { extension: 'jpg', value: 'home.png' } },
    ];
  }


  storeDate(data) {
    // sort storage to get the LRU 
    // TODO : perfom sorting on mongoDB data
    this.cacheStorage.sort((a, b) => {
      const A = a.LRU;
      const B = b.LRU;
      let comparison = 0;
      if (A > B) {
        comparison = 1;
      } else if (A < B) {
        comparison = -1;
      }

      return comparison
    })

    // check to make sure the storage is not more than 10 to keep the storage small ideally
    if (this.cacheStorage.length === 10) {
      // TODO : perfom data on mongoDB instead

      this.cacheStorage.shift() //removing the least recently used since storage is full

      let dataToBeStore = structureAndStoreDate(data)
      this.cacheStorage.push(dataToBeStore)
    } else {
      let dataToBeStore = structureAndStoreDate(data)
      this.cacheStorage.push(dataToBeStore)
    }

    console.log(this.cacheStorage)
  }

  structureAndStoreDate(data) {
    // extracting name and extension from data
    let str = data.toString()
    var file = str.split('/').pop();
    const dataInfo = { name: file.substr(0, file.lastIndexOf('.')), extension: file.substr(file.lastIndexOf('.') + 1, file.length) }

    // TODO : convert data to base64 and store
    let encodedData = '';
    return data = {
      key: dataInfo.name,
      LRU: 1,
      data: {
        extension: dataInfo.extension,
        value: encodedData//encoded data
      },
    }
  }

  getData(data) {
    // extracting name and extension from data
    let str = data.toString()
    var file = str.split('/').pop();
    const dataInfo = { name: file.substr(0, file.lastIndexOf('.')), extension: file.substr(file.lastIndexOf('.') + 1, file.length) }

    return new Promise((resolve, reject) => {
      // TODO : get data from mongoDB storage
      let index = this.cacheStorage.findIndex((c) => c.key === dataInfo.name);

      if (index > -1) {
        this.cacheStorage[index].LRU++
        let data = this.cacheStorage[index];
        return resolve(data);
      } else {
        return reject()
      }
    })
  }

}

const cacheStore = new CacheStore();

// getting data from cacheStorage
async function getData(data) {
  try {
    const dataFromStorage = await cacheStore.getData(data);
    console.log(dataFromStorage)
  } catch (e) {
    console.log('data not found')
    cacheStore.storeDate(data)
  }
}

getData('profileImage.png')


// problems how to get the data to store if the data is not found in the cache storage ??