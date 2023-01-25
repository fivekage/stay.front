<template>
  <h2 class="text-center">Se connecter</h2>
  <section id="firebaseui-auth-container"></section>
</template>

<script>
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
export default {
  name: "Login",
  data() {
    return {};
  },
  mounted() {
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    let uiConfig = {
      signInSuccessUrl: "/profile", // This redirect can be achived by route using callback.
      signInFlow: "popup",
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: function (authResult) {
          console.log(authResult);

          return false;
        },
      },
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  },
};
</script>

<style></style>
