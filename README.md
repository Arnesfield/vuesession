# vuesession
A simple session plugin for Vue.js.

## v1.0.1 Highlights
- Fix `delete`.
- Fix `timeout`.

## Introduction
This project is my own implementation and is based on [vue-session](https://github.com/victorsferreira/vue-session). Go check it out, too!

## Installation
- Install with [npm](https://www.npmjs.com/): `npm install vuesession`

## Include
Include `vuesession` in your project.
```javascript
import Vue from 'vue'
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
- `this.$sess.set(obj [, callback(obj, set)])` - add an object, call `callback` function after set, returns `true` if successful
- `this.$sess.exists([key])` - returns `true` if session or a `key` value exists
- `this.$sess.delete(key)` - returns `true` if successful delete of `key`
- `this.$sess.destroy()` - returns `true` if successfully removed `vuesession` key
- `this.$sess.timer(key, callback(get), timeout(get))` - if `key` exists, do `callback`; `timeout` returns msec
- `this.$sess.timeout(key, logged, until [, callback(get, res)])` - `logged` time, `until` what time `key` expires, and call `callback` after expiration

## Example

For the detailed example, go [here](https://github.com/Arnesfield/vuesession/tree/master/src).

## Copyright and License
**vuesession** is licensed under the [MIT License](https://github.com/Arnesfield/vuesession/blob/master/LICENSE).

## Note
Have fun and happy coding!