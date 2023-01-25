import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login";
import DirectLink from "@/views/DirectLink";
import Profile from "@/views/Profile";
import Map from "@/views/Map";
import firebase from "firebase/compat/app";
import AddRoom from "@/components/AddRoom";

const routes = [
  {
    path: "/addRoom",
    name: "AddRoom", // will be deleted, just used for testing
    component: AddRoom,
  },
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
    path: "/",
    name: "Map",
    component: Map,
  },
  {
    path: "/direct-link",
    name: "DirectLink",
    component: DirectLink,
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
