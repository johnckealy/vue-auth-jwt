import axios from 'axios'

// Sends all the backend requests with
// the JWT tokens attached
axios.defaults.withCredentials = true;



// Vuex module to handle the authorizations
const Auth = (config) => {

  if (!config.API_BASE_URL) {
    throw "I didn't find the URL for your backend in the" +
    "options. Please set the API_BASE_URL option.";
  }

  axios.defaults.baseURL = config.API_BASE_URL;

  return {
    namespaced: true,

    getters: {},

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
          return true
        }
        catch {
          return false
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
            console.log('response', response)
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
        store.commit("updateRedirectUrl", '/');
        return true
      }
    },

    state() {
      return {
        loginDialog: false,
        redirectUrl: '/',
        authToken: null,
        authUser: null
      }
    }
  }
}
export { Auth, axios }
