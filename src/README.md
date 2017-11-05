# example
Create `TimeoutMixin.js` with a timeout call.

```javascript
export default {
  methods: {
    callTimeout: function() {
      // second to third parameters must match the name of the fields
      // of 'userKey' object
      return this.$sess.timeout('userKey', 'loggedIn', 'timeout', (get, res) => {
        // function params (get, res) in src/
        // 'res' determines if 'key' existed and if the delete was successful
        if (res === false) {
          // return, in case 'userKey' was already deleted
          // like through 'logout'
          return
        }
        alert('Your session has expired.')
        // sample route change
        this.$router.push('/login')
      })
    }
  }
}
```

Create a `Logged` and `NotLogged` mixin for checking.

`Logged.js` - mix with components that need to be logged in.

```javascript
export default {
  created() {
    this.checkIfLogged()
  },
  methods: {
    checkIfLogged: function() {
      if (!this.$sess.exists('userKey')) {
        this.$router.push('/login')
      }
    }
  }
}
```

`NotLogged.js` - mix with components that need to be logged out.

```javascript
export default {
  created() {
    this.checkIfNotLogged()
  },
  methods: {
    checkIfNotLogged: function() {
      if (this.$sess.exists('userKey')) {
        this.$router.push('/')
      }
    }
  }
}
```

`App.vue`, your main app.

```javascript
import TimeoutMixin from 'path/to/TimeoutMixin.js'
import Logged from 'path/to/Logged.js'

export default {
  name: 'app',
  mixins: [TimeoutMixin, Logged],
  created: function() {
    // if executes and true, 'userKey' already exists and it continues countdown
    if (!this.callTimeout()) {
      // if not, go to login
      this.$router.push('/login')
    }
  },
  updated() {
    this.checkIfLogged()
  }
}
```

`Login.vue`, your login component (usually under your `App.vue`).

```javascript
import TimeoutMixin from 'path/to/TimeoutMixin.js'
import NotLogged from 'path/to/NotLogged.js'

export default {
  name: 'login',
  mixins: [TimeoutMixin, NotLogged],
  data: {
    url: '...',
    post: { ... }
  },

  methods: {
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
          this.$router.push('/')
          console.log(result)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }

}
```

Have fun and happy coding!