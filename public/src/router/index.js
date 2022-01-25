import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import HowTo from '../views/HowTo.vue'
import LinkSpotify from '../views/LinkSpotify.vue'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import Settings from '../views/Settings.vue'
import ResetPassword from '../views/ResetPassword.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/howto',
    name: 'HowTo',
    component: HowTo,
  },
  {
    path: '/linkspotify',
    name: 'LinkSpotify',
    component: LinkSpotify,
    beforeEnter: (to, from, next) => {
      if (localStorage.jwt && localStorage.spotify_refresh) {
        next("/dashboard");
      }else if(localStorage.jwt){
        next();
      }else{
        next("/");
      }
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      if (localStorage.jwt && localStorage.spotify_refresh) {
        next();
      }else{
        next("/linkspotify");
      }
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    beforeEnter: (to, from, next) => {
      if (localStorage.jwt && localStorage.spotify_refresh) {
        next();
      }else{
        next("/linkspotify");
      }
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      if (localStorage.jwt && localStorage.spotify_refresh) {
        next("/dashboard");
      } else if(localStorage.jwt){
        next("/linkspotify");
      }else{
        next();
      }
    }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
    beforeEnter: (to, from, next) => {
      if (localStorage.jwt && localStorage.spotify_refresh) {
        next("/dashboard");
      } else if(localStorage.jwt){
        next("/linkspotify");
      }else{
        next();
      }
    }
  },
  {
    path: '/resetpassword',
    name: 'ResetPassword',
    component: ResetPassword,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
