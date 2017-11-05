var VueSession = {

  /**
   * Configuration object
   *
   * Modify via options.
   */
  config: {

    /**
     * The key for the session.
     *
     * Default is 'vue-sess-key'
     */
    key: 'vue-sess-key',

    /**
     * Set to 'local' for LocalStorage or
     * set to 'session' for SessionStorage
     */
    saveTo: 'local'
  },

  /**
   * Main getter method.
   *
   * Get the whole session object.
   *
   * @returns An object of data
   */
  _get: function() {
    var data = null

    if (this.config.saveTo === 'local') {
      data = window.localStorage.getItem(this.config.key)
    }
    else if (this.config.saveTo === 'session') {
      data = window.sessionStorage.getItem(this.config.key)
    }

    return JSON.parse(data) || {}
  },

  /**
   * Main setter method.
   *
   * Add or overwrite an object in the session.
   *
   * @param {object} data An object - key-value pair to be added
   * @param {boolean} overwrite true if data should overwrite the current session
   * @returns true if successful; otherwise, false
   */
  _set: function(data, overwrite) {
    // check if data is valid
    if (!data || data.constructor === Array) {
      return false
    }

    // get all
    var get = this._get()
    var obj = overwrite ? data : Object.assign(get, data)
    const jsonStr = JSON.stringify(obj)

    if (this.config.saveTo === 'local') {
      window.localStorage.setItem(this.config.key, jsonStr)
      return true
    }
    else if (this.config.saveTo === 'session') {
      window.sessionStorage.setItem(this.config.key, jsonStr)
      return true
    }

    return false
  },

  /**
   * Main delete method.
   *
   * Deletes a value in the session.
   *
   * @param {string} key The key of the data to be removed
   * @returns The _set() result
   */
  _delete: function(key) {
    var get = this._get()
    if (get[key] == null) {
      return false
    }
    delete get[key]
    return this._set(get, true)
  },

  /**
   * Main destroy method.
   *
   * Deletes the whole session string.
   *
   * @returns true if successful; otherwise, false
   */
  _destroy: function() {
    if (this.config.saveTo === 'local') {
      window.localStorage.removeItem(this.config.key)
      return true
    }
    else if (this.config.saveTo === 'session') {
      window.sessionStorage.removeItem(this.config.key)
      return true
    }

    return false
  }

}

VueSession.install = function(Vue, options) {
  const self = this

  // add options
  if (typeof options === 'object') {
    Object.assign(this.config, options)
  }

  Vue.prototype.$sess = {

    /**
     * Get method.
     *
     * Get the parsed JSON string from storage.
     *
     * @param {any} key The key of the data to be returned
     * @returns The whole session object or the value of the key
     */
    get: function(key) {
      return typeof key !== 'string' ? self._get() : self._get()[key]
    },

    /**
     * Set method.
     *
     * Add an object in the session.
     *
     * @param {any} obj The key-value pair to be added
     * @param {function} callback A callback function called after set
     * @returns Set or both set and callback result
     */
    set: function(obj, callback) {
      const set = self._set(obj)

      if (typeof callback === 'function') {
        return { result: set, callback: callback(obj, set) }
      }

      return set
    },

    /**
     * Exists method.
     *
     * Check if session or a specific key exists.
     *
     * @param {any} key The key to be checked
     * @returns true if exists; otherwise, false
     */
    exists: function(key) {
      if (typeof key !== 'undefined') {
        return typeof self._get()[key] !== 'undefined'
      }
      return typeof self._get() !== 'undefined'
    },

    /**
     * Timer method.
     *
     * Call a function after some time if key exists.
     *
     * @param {any} key The key to be checked
     * @param {function} callback The function to be called
     * @param {function} timeout Returns the timeout milliseconds
     * @returns true if successful; otherwise, false
     */
    timer: function(key, callback, timeout) {
      const get = this.get(key)

      if (typeof get === 'undefined' || typeof callback !== 'function' || typeof timeout !== 'function') {
        return false
      }

      setTimeout(function() { callback(get) }, timeout(get))
      return true
    },

    /**
     * Timeout method.
     *
     * Deletes key-value pair in session.
     *
     * @param {any} key The key to be checked
     * @param {number} logged The key wherein an item or a user was logged in milliseconds
     * @param {number} until The timeout key with a value in milliseconds
     * @param {function} callback Called after key is deleted
     * @returns true if successful; otherwise, false
     */
    timeout: function(key, logged, until, callback) {
      const sess = this
      return this.timer(key, function(get) {
        const res = sess.delete(key)
        if (typeof callback === 'function') {
          callback(get, res)
        }
      }, function(get) {
        const msec = get[until] - (Date.now() - get[logged])
        return msec < 0 ? 0 : msec
      })
    },

    /**
     * Delete method.
     *
     * Remove a value with the specified key from the session.
     *
     * @param {any} key The key of the data to be removed
     * @returns true if successful; otherwise, false
     */
    delete: function(key) {
      return typeof key === 'string' ? self._delete(key) : false
    },

    /**
     *
     * Destroy method.
     *
     * Deletes the whole session string.
     *
     * @returns true if successful; otherwise, false
     */
    destroy: function() {
      return self._destroy()
    }

  }
}

export default VueSession
