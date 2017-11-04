# vuesession
A simple session plugin for Vue.js.

## Introduction
This project is my own implementation and is based on [vue-session](https://github.com/victorsferreira/vue-session). Go check it out, too!

## Installation
- Install with [npm](https://www.npmjs.com/): `npm install vuesession`

## Include
Include `vuesession` in your project.
```javascript
import VueSession from 'vuesession'
Vue.use(VueSession)
```

### Configuration
`vuesession` offers tiny configuration.
```javascript
// by default from src/
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
}
```

To override default configuration, add options:

```javascript
// override config
Vue.use(VueSession, {
  saveTo: 'session'
  // , ...
})
```

You can now access the `$sess` property through your components.

## Usage
- `this.$sess.get([key])` - returns all if `key` is not set
- `this.$sess.set(obj [, callback])` - add an object, call `callback` function after set, returns true if successful
- `this.$sess.exists([key])` - returns true if session or a `key` value exists
- `this.$sess.delete(key)` - returns true if successful delete of `key`
- `this.$sess.destroy()` - returns true if successfully removed `vuesession` key
- `this.$sess.timer(key, callback, timeout)` - if `key` exists, do `callback`; `timeout` returns msec
- `this.$sess.timeout(key, logged, until [, callback])` - `logged` in time, `until` what time `key` expires, and call `callback` after expiration

## Example
```javascript
export default {
  name: 'login',
  data: {
    url: '...',
    post: { ... }
  },

  created: function() {
    // if executes, userKey already exists
    // and it continues countdown
    if (this.callTimeout()) {
      // so proceed to somewhere else
      this.$router.push({ path: '/home' })
    }
  },

  methods: {
    callTimeout: function() {
      // second to third parameters must match the name of the fields
      // of 'userKey' object
      return this.$sess.timeout('userKey', 'loggedIn', 'timeout', () => {
        alert('Your session has expired.')
        // sample route change
        this.$router.push({ path: '/login' })
      })
    },

    submit: function() {
      this.$http
        .post(this.url, this.post)
        .then(res => {
          // assume userData has { ..., loggedIn: 1509815572144, timeout: 360000 }
          // session will expire after 360000 msec of loggedIn value of 1509815572144
          // set 'userKey', 'loggedIn', and 'timeout' names correctly
          // in '$sess.timeout' in 'callTimeout'
          const userData = res.data.user
          const result = this.$sess.set({ 'userKey': userData }, this.callTimeout)
          console.log(result)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }

}
```

## Copyright and License
**vuesession** is licensed under the [MIT License](https://github.com/Arnesfield/vuesession/blob/master/LICENSE).

## Note
Have fun and happy coding!