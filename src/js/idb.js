import idb from 'idb'

class IDB {
  static get OBJECT_STORE () {
    return 'restaurants'
  }
  static get IDB_NAME () {
    return 'restaurant-db'
  }

  /** Returns the DB or creates it if it does not exist */
  static dbPromise () {
    return idb.open(this.IDB_NAME, 1, (upgradeDb) => {
    //   const restaurantStore = upgradeDb.createObjectStore(this.OBJECT_STORE)
      const restaurantStore = upgradeDb.createObjectStore(this.OBJECT_STORE, {
        keyPath: 'id'
      })
      return restaurantStore
    //   restaurantStore.put('val', 'key')
    })
  }

  /** Stores all the restaurants in IDB */
  static storeRestaurants (dataPromise) {
    dataPromise.then(data => {
      this.dbPromise().then(db => {
        const tx = db.transaction(this.OBJECT_STORE, 'readwrite')
        const restaurantStore = tx.objectStore(this.OBJECT_STORE)
        // restaurantStore.put(data[0])

        // Save each restaurant in IDB
        data.forEach(element => {
          if (element) {
            // console.log('ele', element)
            restaurantStore.put(element)
          }
        })
        // Completed transaction
        return tx.complete
      })
        .then(() => {
          console.log('Added all restaurants successfully')
        })
        .catch((error) => {
          console.log('Failed to save the restaurants into IDB', error)
        })
    })
  }

  /** Retrieves a restaurant from IDB through its id */
  static getRestaurantById (id) {
    return this.dbPromise().then(db => {
      const tx = db.transaction(this.OBJECT_STORE)
      const restaurantStore = tx.objectStore(this.OBJECT_STORE)
      return restaurantStore.get(id)
    })
      .then(val => {
        console.log('the value of key is:', val)
      })
      .catch(() => {
        console.log(`No restaurant with the id ${id}`)
      })
  }

  static getAllRestaurants () {
    return this.dbPromise().then(db => {
      const tx = db.transaction(this.OBJECT_STORE)
      const restaurantStore = tx.objectStore(this.OBJECT_STORE)
      return restaurantStore.getAll()
    })
  }
}

export default IDB
