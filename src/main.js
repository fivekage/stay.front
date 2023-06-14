import firebase from "firebase/compat/app";
import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./routes";

// read and parse config from .env file
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};

console.log("API URL: " + process.env.VUE_APP_API_BASE_URL);

// globally store google maps config
window.googleMapsConfig = {
  apiKey: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
};

// Vuetify
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    "surface-transparent": "#AAAAAA00",
    primary: "#E08600",
    "primary-darker": "#B56C00",
    secondary: "#03DAC6",
    "secondary-darken-1": "#018786",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
};

const myCustomDarkTheme = {
  dark: true,
  colors: {
    background: "#000",
    surface: "#000",
    "surface-transparent": "#000A",
    primary: "#FFF",
    "primary-darker": "#FFF",
    secondary: "#03DAC6",
    "secondary-darken-1": "#018786",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
};

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: "myCustomLightTheme",
    themes: {
      myCustomLightTheme,
      myCustomDarkTheme,
    },
  },
});

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

createApp(App).use(vuetify).use(router).mount("#app");
