import { Auth, axios } from './auth';
import { authDirects } from './redirects';



/* This will be the base $auth function. */
const auth = (state, config) => {

  const authenticator = Auth(config)
  state.store.registerModule('authenticator', authenticator)

  return {
    login(user) {
      return state.store.dispatch("authenticator/AUTH_LOGIN", user);
    },
    logout() {
      state.store.dispatch("authenticator/AUTH_LOGOUT");
    },
    checkTokens() {
      state.store.dispatch("authenticator/CHECK_TOKENS");
    },
    axios: axios
  };
}

export { auth }           // This will be assigned to $auth
export { authDirects };   // optional: redirect to login page
