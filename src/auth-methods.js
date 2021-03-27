import { authModule, axios } from './auth-module';


/* This will be the base $auth function. */
const authMethods = (store, config) => {

  const authenticator = authModule(config)
  store.registerModule('authenticator', authenticator)

  return {
    axios: axios,
    checkTokens() {
      store.dispatch("authenticator/CHECK_TOKENS");
    },
    login(user) {
      return store.dispatch("authenticator/AUTH_LOGIN", user);
    },
    logout() {
      store.dispatch("authenticator/AUTH_LOGOUT");
    },
    register(user) {
      return store.dispatch("authenticator/REGISTER", user);
    },
    state() {
      return store.state;
    },
    user(backend = false) {
      if (backend) {
        return store.dispatch("authenticator/AUTH_USER");
      }
      else {
        return store.getters['authenticator/authUser']
      }
    }
  };
}

export { authMethods }