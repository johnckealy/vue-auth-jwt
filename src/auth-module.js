import axios from 'axios'

// Sends all the backend requests with
// the JWT tokens attached
axios.defaults.withCredentials = true;


const setDefaults = (config, param, endpoint) => {
  if (!config[param]) {
    console.warn(`vue-auth-jwt: I didn't find the ${param} ` +
      `configuration option. Using the default value '${endpoint}'`);
    config[param] = endpoint;
  }
}


// Vuex module to handle the authorizations
const authModule = (config) => {

  if (!config.API_BASE_URL) {
    throw "I didn't find the URL for your backend in the" +
    "options. Please set the API_BASE_URL option.";
  }
  setDefaults(config, 'loginEndpoint', '/login/')
  setDefaults(config, 'logoutEndpoint', '/logout/')
  setDefaults(config, 'tokenRefreshEndpoint', '/token/refresh/')
  setDefaults(config, 'userEndpoint', '/user/')
  setDefaults(config, 'loginRoute', '/login')
  setDefaults(config, 'registrationEndpoint', '/register/')
  setDefaults(config, 'defaultRedirectUrl', '/')


  axios.defaults.baseURL = config.API_BASE_URL;

  return {
    namespaced: true,

    getters: {
      authUser: (state) => state.authUser,
      redirectUrl: (state) => state.redirectUrl
    },

    mutations: {
      closeLoginDialog: (state) => {
        state.loginDialog = false;
      },
      openLoginDialog: (state) => {
        state.loginDialog = true;
      },
      updateRedirectUrl: (state, url) => {
        state.redirectUrl = url;
      },
      setAuthUser: (state, authUser) => {
        state.authUser = authUser;
      }
    },

    actions: {
      AUTH_LOGIN: async (store, user) => {
        try {
          const response = await axios({ url: config.loginEndpoint, data: user, method: 'POST' })
          store.commit("setAuthUser", response.data.user);
          return response
        }
        catch (e) {
          let errorMessages = [];
          if (!e.response) {
            return ['Oops! There was an problem on our end. Please try agin later.']
          }
          Object.values(e.response.data).forEach(message => {
            if (Array.isArray(message)) {
              message.forEach(m => {
                errorMessages.push(m)
              })
            }
          })
          return errorMessages
        }
      },
      REGISTER: async (store, user) => {
        try {
          const response = await axios({ url: config.registrationEndpoint, data: user, method: 'POST' })
          store.commit("setAuthUser", response.data.user);
          return response
        }
        catch (e) {
          let errorMessages = [];
          Object.values(e.response.data).forEach(message => {
            if (Array.isArray(message)) {
              message.forEach(m => {
                errorMessages.push(m)
              })
            }
          })

          return errorMessages
        }
      },
      CHECK_TOKENS: async (store) => {
        try {
          const response = await axios({ url: config.userEndpoint, method: 'GET' })
          store.commit("setAuthUser", response.data);
        }
        catch (error) {
          console.log('Token verify check failed. Attempting token refresh...')
          try {
            await axios({ url: config.tokenRefreshEndpoint, data: {}, method: 'POST' })
            const response = await axios({ url: config.userEndpoint, method: 'GET' })
            store.commit("setAuthUser", response.data);
          }
          catch {
            console.log('Token refresh attempt failed.')
          }
        }
      },
      AUTH_LOGOUT: async (store) => {
        const response = await axios({ url: config.logoutEndpoint, data: {}, method: 'POST' })
        store.commit("setAuthUser", null);
        store.commit("updateRedirectUrl", config.defaultRedirectUrl);
        return true
      },
      AUTH_USER: async (store) => {
        const response = await axios({ url: config.userEndpoint, method: 'GET' })
        return response.data
      }
    },

    state() {
      return {
        loginDialog: false,
        redirectUrl: '/',
        authUser: null
      }
    }
  }
}
export { authModule, axios }
