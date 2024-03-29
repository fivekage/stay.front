import { createRouter, createWebHistory } from "vue-router";
import firebase from "firebase/compat/app";
import Login from "@/views/Login";
import Chatting from "@/views/Chatting";
import DirectLink from "@/views/DirectLink";
import Profile from "@/views/Profile";
import Map from "@/views/Map";

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
      auth: false,
      guest: true,
    },
  },
  {
    path: "/",
    name: "Map",
    component: Map,
    meta: {
      auth: true,
    },
  },
  {
    path: "/channel/:type/:channelId",
    name: "Channel",
    component: Chatting,
    props: true,
    meta: {
      auth: true,
    },
  },
  {
    path: "/direct",
    name: "DirectLink",
    component: DirectLink,
    meta: {
      auth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
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
