import idb from 'idb'

class IDB {
  static get RESTAURANT_STORE () {
    return 'restaurants'
  }
  static get REVIEW_STORE () {
    return 'reviews'
  }
  static get IDB_NAME () {
    return 'restaurant-db'
  }

  /** Returns the restaurant DB or creates it if it does not exist */

  static dbPromise () {
    return idb.open(this.IDB_NAME, 1, (upgradeDb) => {
      const cenas = upgradeDb.createObjectStore(this.RESTAURANT_STORE, {
        keyPath: 'id'
      })
      upgradeDb.createObjectStore(this.REVIEW_STORE, {
        keyPath: 'id'
      })
      // We create an index to group all reviews by its restaurant
      const reviewStore = upgradeDb.transaction.objectStore(this.REVIEW_STORE)
      reviewStore.createIndex('restaurantId', 'restaurant_id')

      return cenas
    })
  }

  static storeRestaurants (dataPromise) {
    this.storeObjects(dataPromise, this.RESTAURANT_STORE).then(() => {
      console.log('Added all restaurants successfully')
    })
      .catch((error) => {
        console.log('Failed to save the restaurants into IDB', error)
      })
  }

  /** Given an IDB store, saves all the elements into it */
  static storeObjects (dataPromise, OBJECT_STORE) {
    return dataPromise.then(data => {
      this.dbPromise().then(db => {
        const tx = db.transaction(OBJECT_STORE, 'readwrite')
        const objectStore = tx.objectStore(OBJECT_STORE)

        // Save each element in IDB
        data.forEach(element => {
          if (element) {
            objectStore.put(element)
          }
        })
        // Completed transaction
        return tx.complete
      })
    })
  }

  /** Retrieves a restaurant from IDB through its id */
  static getRestaurantById (id) {
    return this.dbPromise().then(db => {
      // debugger//eslint-disable-line

      const tx = db.transaction(this.RESTAURANT_STORE)
      const restaurantStore = tx.objectStore(this.RESTAURANT_STORE)
      // return restaurantStore.get(id)
      return restaurantStore.get(parseInt(id))
    })
    // .then(val => {
    //   console.log('Getting restaurant from IDB:', val)
    // })
    // .catch(() => {
    //   console.log(`No restaurant with the id ${id}`)
    // })
  }

  static getAllRestaurants () {
    return this.dbPromise().then(db => {
      const tx = db.transaction(this.RESTAURANT_STORE)
      const restaurantStore = tx.objectStore(this.RESTAURANT_STORE)

      return restaurantStore.getAll()
    })
  }

  // -------- Reviews --------

  static storeReviews (dataPromise) {
    this.storeObjects(dataPromise, this.REVIEW_STORE)
      .then(() => {
        console.log('Added all reviews successfully')
      })
      .catch((error) => {
        console.log('Failed to save the reviews into IDB', error)
      })
  }

  /** Retrieves all reviews for a given restaurant */
  static getReviewByRestaurantId (restaurantId) {
    return this.dbPromise().then(db => {
      const tx = db.transaction(this.REVIEW_STORE)
      const reviewStore = tx.objectStore(this.REVIEW_STORE)
      const restaurantIdIndex = reviewStore.index('restaurantId')
      return restaurantIdIndex.getAll(parseInt(restaurantId))
    })
  }
}

export default IDB
