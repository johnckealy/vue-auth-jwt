

<img src="https://raw.githubusercontent.com/johnckealy/vue-auth-jwt/main/logo/logo.svg"
     alt="logo image" width="160" />

# Vue Auth JWT

Vue Auth JWT is a lightweight Vue plugin for communicating your Vue application with
a JWT (JSON Web Token) powered authentication backend.

It provides simple simple Vuex-based methods that apply the correct credentials and request
styles to easily add the JWT access tokens in the request headers, and refresh them
when appropriate. 

Also included is an instance of the Axios package, so there is no need to install this separately.

## Requirements

Vue Auth JWT does not make use of localStorage, which is vunerable to cross-site scripting (XSS) attacks.
Instead, it assumes that the application's backend uses `httpOnly` cookies, which javascript has
no access to.

For this reason, to make the library work, your backend must set the tokens directly. For example,
if you're a Python user, the Django library `dj-rest-auth` has a setting for JWT which sends the cookies in
just the right way. Whatever backend you use, be sure the tokens are sent directly as httpOnly cookies,
and be sure CORS is set up correctly.

You will also need:

– A working Vue.js application (including Vue frameworks, like Nuxt or Quasar)

– A working JWT backend, such as Django Simple JWT

– A Vuex store installed

– A Vue router instance

## Installation

To install Vue Auth JWT, first add it to your project

```
npm install vue-auth-jwt
```
or
```
yarn add vue-auth-jwt
```

Then instantiate the plugin by adding:

```javascript
    const config = {
      API_BASE_URL: 'https://api.example.com:8000/',
    }

    Vue.use(Auth, { router, store, config  });
```

The location of this code will vary depending on your set up,
but it must have access to the Vue Router and Vue Store instances.

The only mandatory endpoint to add to the configuration is `API_BASE_URL`,
but it is likely that others will also be necessary to serve even basic JWT backends.
The full list of configuation options can be found in the `Configuration Options`
section below.


### TLS and `same-site` concerns

Although `vue-auth-jwt` has been written with decoupling between frontend and backend in mind,
it may be necessary to host both frontend and backend at the same domain. However, subdomains
are fine, so if you run your site at `example.com`, you can still host your backend at `api.example.com`.

While using these subdomain names will be trivial in production, setting up a development environment with domain names
and SSL is less obvious.

You can set the localhost IP address (usually 127.0.0.1)
to a custom domain in your hosts file (this will be `/etc/hosts` in Unix), and then run your dev environment at
something like
```
https://api.example.com:8000
```

Note the `https` here. It may also be necessary to use SSL/TLS (even in your development environment)
and run your backend within the remit of the `same-site` attribute. There exist libraries
(like `django-sslserver` in Python) that will allow you to run with a self-signed SSL certificate for development.

If you'd like to read more about the `same-site` attribute, please follow [this link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite).


### Authorization and redirection

If an authenticated route is requested, `vue-auth-jwt` will attempt to
validate the user's cookies, and will redirect the user to a
login screen if they cannot be verified.

As you choose which routes should be protected by the
authorization, simply add `meta: { requiresAuth: true }`
to each route.

For more information on the `meta` attribute, have a look at
[this](https://router.vuejs.org/guide/advanced/meta.html).


## Configuration Options

#### API_BASE_URL
Default:   `'/login/'`

HTTP verb:    `POST`

This sets the name of your backend's API endpoint for logging in.

#### logoutEndpoint
Default:      `'/logout/'`

HTTP verb:    `POST`

This sets the name of your backend's API endpoint for logging out.

#### tokenRefreshEndpoint
Default:       `'/token/refresh'`

HTTP verb:     `POST`

For refreshing the JWT access token. This will usually be done automatically
by `vue-auth-jwt` when appropriate.

#### userEndpoint
Default:       `'/user/'`

HTTP verb:     `GET`

Endpoint for obtaing details about the logged in user. Should return
an object containing user details (e.g. first_name, username, email, etc.).

#### loginRoute
Default:       `'/login'`

HTTP verb:     `None`

Rather than being an endpoint on the external API, the `loginRoute` configuration option
is for the login page i.e. it is one of the internal Vue router paths. If
a user is not authorized to visit a page, this is the page they will
instead be directed to. This page can be anything, but is mostly typically
composed of a login form component.  



## API Reference

When initialized, `vue-auth-jwt` provides access to its methods from anywhere in the Vue app
through the use of the global `$auth` attribute. `$auth` has access to the methods detailed
below.

The following methods belong to the `$auth` attribute
set in the installation step.



#### `axios()`
An instance of the Axios package, configured to handle
the JWT credentials automatically. The baseURL configuration
is already set to the given `API_BASE_URL` value.
You can use this function just as you would any normal `axios` request.

Sample Usage
```javascript
  async getUserDetails() {
    return await this.$auth.axios({ url: '/user/', method: 'GET' });
  }
```



#### `checkTokens()`

Verifies that the JWT access tokens are still valid, and attempts
to refresh them if they are not.


#### `login()`

Should be attached to the submit button of the login form.
Returns the response from the server, or the error messages
if the request failed.

`Input Parameters`: Object containing `username` and `password`
fields, formatted to match your backend's expectations.

Sample Usage
```javascript
  async onSubmitLogin() {
    try {
      const reponse = await this.$auth.login({
        username: 'bojangles',
        password: 'secret123'
      })
    }
    catch {
      this.errorMessages = response;
    }
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


#### `register()`

Register a new user.

`Input Parameters`: Object containing registration fields
(e.g. email, password, confirm-password, name), formatted
to match the backend's expectations.

Sample Usage
```javascript
    async onSubmitRegistration() {
      const resp = await this.$auth.register({
        email: this.email,
        first_name: this.firstName,
        password1: this.password1,
        password2: this.password2,
      });
      if (resp.status == 201) {
        console.log("Account created successfully");
        this.$router.push("/");
      } else {
        console.log('Registration failed!)
        this.errorMessages = resp;
      }
    }
```

#### `user()`

Returns details about the logged in user. If `backend` is
set to `false` (default), the method will simply return the
user details currently set in the Vuex state. To query the
backend for the up-to-date user info, set `backend=true`.

Sample Usage
```javascript
  async getUserDetails() {
    const user = await this.$auth.user(backend=false)
  }
```



# Contributions

`vue-auth-jwt` is a very young open source tool, and I would be very
happy to welcome contributors. If you would like
to contribute, feel free to open an issue or pull request.
You can also send me an email at `johnckealy.dev@gmail.com`.