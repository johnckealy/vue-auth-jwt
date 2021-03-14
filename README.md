# Vue Auth JWT

Vue Auth JWT is a lightweight library for communicating your Vue application with
a JWT (JSON Web Tokens) powered authentication backend.

It provides simple Vuex functions that apply the correct credentials and request
styles to easily add the JWT access tokens in the header, and refresh them
when appropriate.

### Requirements

– A working Vue.js application (Including Vue frameworks, like Nuxt or Quasar)

– A working JWT backend, such as Django Simple JWT

– A Vuex store installed

### Installation

To install Vue Auth JWT, first add it to your project

```
npm install vue-auth-jwt
```
or
```
yarn add vue-auth-jwt
```

In the file where your Vuex store is initated, add the following entrypoint code:

```javascript
import Auth from 'vue-auth-jwt'

const auth = Auth({
    API_URL: 'http://localhost:8000',
})
```
`API_URL` is the only mandatory configuration parameter, it's the base URL of
your JWT API. You can find the other options below.

After initializing `auth` with the desired options, add the
module to your pre-existing Vuex store:

```javascript
    ...

  const Store = new Vuex.Store({
    modules: {
      auth  // Add it here
    },

    ...

```

### Configuration Options

##### loginEndpoint
default   `'/login/'`

HTTP verb    `POST`

This is the name of your backend API endpoint for logging in

##### logoutEndpoint
default      `'/logout/'`

HTTP verb    `POST`

This is the name of your backend API endpoint for logging out

##### userEndpoint:
default       `'/user/'`

HTTP verb     `GET`

Endpoint for obtaing details about the logged in user. Should return
an object containing user details

##### tokenRefreshEndpoint:
default       `'/token/refresh'`

HTTP verb     `POST`

For refreshing the JWT access token. This will usually be done automatically
by vue-auth-jwt when appropriate



### API Reference

#### `closeLoginDialog()`
For use with popup modals and other dynamic logins. You can set the
v-model of the login form to the state variable `loginDialog`, and
close the dialog with this.

Sample Usage:
```javascript
this.$store.commit("auth/closeLoginDialog");
```

#### `openLoginDialog()`

As `closeLoginDialog` but opens the form.


#### `AUTH_LOGIN()`

Should be attached to the submit button of the login form.
Returns a boolean indicating the success or failure of the
request.

Sample Usage
```
 this.$store.dispatch("auth/AUTH_LOGIN", formData);
```


See the `worked examples` section for a full example
method.


 ### Examples

Add the following to any Vue component (typically a login form component), attaching the
submit button to the `onSubmit()` event.
 ```javascript

  ...

  methods: {
    async onSubmit() {
      const loginOk = await this.$store.dispatch("auth/AUTH_LOGIN", {
        username: formData.username,   // Attach the data entered
        password: formData.password,   // in form fields
      });
      if (loginOk) {
        this.$q.notify({ message: "Login was successful" });
        this.closeLoginDialog();   // if using the loginDialog state variable
      } else {
        // Add error handling logic here
      }
    }
  }
```