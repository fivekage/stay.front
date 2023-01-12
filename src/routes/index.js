import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login";
import Home from "@/views/Home";
import Profile from "@/views/Profile";
import Map from "@/views/Map";
import firebase from "firebase/compat/app";

const routes = [
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      auth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      guest: true,
    },
  },
  {
    path: "/map",
    name: "Map",
    component: Map,
  },
  {
    path: "/",
    name: "Home",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.auth)) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        next();
      } else {
        next({
          path: "/login",
        });
      }
    });
  } else if (to.matched.some((record) => record.meta.guest)) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        next({
          path: "/profile",
        });
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

export default router;
