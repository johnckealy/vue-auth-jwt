/* Redirects. This method checks whether a route requires authentication,
  then redirects the user to the login route
   if needed. */
const authDirects = async (to, next, store, loginFormRoute) => {
    if (to.matched.some(route => route.meta.requiresAuth)) {
        await store.dispatch("authenticator/CHECK_TOKENS");
        if (!!store.state.authenticator.authUser) {
            next();
        } else {
            store.commit("authenticator/updateRedirectUrl", to.path);
            next(loginFormRoute);
        }
    } else {
        next();
    }
}
export { authDirects }