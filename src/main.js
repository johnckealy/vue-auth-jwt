import LoginForm from './components/LoginForm.vue'
import { Auth } from './auth'


const Components = {
  install (Vue) {
    Vue.component('login-form', LoginForm)
  }
}

export default Auth;
export { Components };