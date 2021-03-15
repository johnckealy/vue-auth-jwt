# Vue Auth JWT

Vue Auth JWT is a lightweight library for communicating your Vue application with
a JWT (JSON Web Tokens) powered authentication backend.

It provides simple Vuex functions that apply the correct credentials and request
styles to easily add the JWT access tokens in the header, and refresh them
when appropriate.

## Requirements

– A working Vue.js application (Including Vue frameworks, like Nuxt or Quasar)

– A working JWT backend, such as Django Simple JWT

– A Vuex store installed

## Installation

To install Vue Auth JWT, first add it to your project

```
npm install vue-auth-jwt
```
or
```
yarn add vue-auth-jwt
```

Create a file (something like `auth.js`), and place it where other external
modules tend to go. For instance, in `@vue/cli` apps, place it in 


The only mandatory endpoint is `API_BASE_URL`, but it is likely
the others will also be necessary to serve even basic JWT backends.

### Authorization and redirection

If an authenticated route is requested, `vue-auth-jwt` will attempt to
validate the user's cookies, and will redirect the user to a
login screen if they cannot be verified.

To use redirection, there is an extra installation step. In your
Vue application's router file (this is located in `src/routes/index.js`
for @vue/cli and QuasarFramework apps), add the following code after
the router instance has been declared:

```javascript

import { authDirects } from 'vue-auth-jwt'

  ...

  const Router = new VueRouter({
    ...
  }

  // Add this method in your router instance.
  // '/login' should be replaced with the
  // route to your Vue app's login form.
  Router.beforeEach((to, from, next) => {
    authDirects(to, next, store, '/login');
  });

```
As you choose which routes should be protected by the
authorization, you can add `meta: { requiresAuth: true }`
to each route.


## Configuration Options

##### API_BASE_URL
default   `'/login/'`

HTTP verb    `POST`

This is the name of your backend API endpoint for logging in

##### logoutEndpoint
default      `'/logout/'`

HTTP verb    `POST`

This is the name of your backend API endpoint for logging out

##### tokenRefreshEndpoint:
default       `'/token/refresh'`

HTTP verb     `POST`

For refreshing the JWT access token. This will usually be done automatically
by vue-auth-jwt when appropriate

##### userEndpoint:
default       `'/user/'`

HTTP verb     `GET`

Endpoint for obtaing details about the logged in user. Should return
an object containing user details


## API Reference

The following functions belong to the `$auth` method
set in the installation step.


#### `axios()`
An instance of the Axios package, configured to handle
the JWT credentials automatically. The baseURL configuration
is already set to the given API_BASE_URL value.
You can use this function just as you any normal axios request.

Sample Usage
```javascript
  asycn getUserDetails() {
    return await this.$auth.axios({ url: '/user/', method: 'GET' });
  }
```

#### `checkTokens()`

Verifies that the JWT access tokens are still valid, and attempts
to refresh them if they are not.

If you've installed the `authDirects` methods in your router index file,
this will be called automatically when authenticated routes are requested.


#### `login()`

Should be attached to the submit button of the login form.
Returns a boolean indicating the success or failure of the
request.

Sample Usage
```javascript
  async onSubmitLogin() {
    const loginOk = await this.$auth.login({
      username: 'phil',
      password: 'secret123'
    })
  }
```

#### `logout()`

Logs out the user.

Sample Usage
```javascript
  async onSubmitLogout() {
    await this.$auth.logout()
  }
```

#### `logout()`

Returns details about the logged in user.

Sample Usage
```javascript
  async onSubmitLogout() {
    await this.$auth.user()
  }
```
Note: `user()` actually runs a query
in the backend. If you just need details on
the logged in user, you can use
the Vuex state variable, `authUser`:
```
this.$store.state.authenticator.authUser
```