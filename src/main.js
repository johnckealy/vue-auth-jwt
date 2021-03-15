import { authDirects } from './redirects';
import { authMethods } from './auth-methods';


export default {
  install: function (Vue, options) {
    options.router.beforeEach((to, from, next) => {
      authDirects(to, next, options.store, options.config.loginRoute);
    });

    Object.defineProperty(
      Vue.prototype, '$auth', {
        value: authMethods(options.store, options.config)
      }
    )
  }
}
