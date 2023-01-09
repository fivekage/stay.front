<template>
  <v-navigation-drawer color="grey-darken" v-model="drawer" temporary>
    <v-list color="transparent">
      <v-list-item prepend-icon="mdi-view-dashboard" title="Tableau de bord">
        <router-link to="/" />
      </v-list-item>

      <v-list-item
        v-show="!user"
        prepend-icon="mdi-account-box"
        title="Se connecter"
      >
        <router-link to="/login" />
      </v-list-item>
      <v-list-item v-show="user" prepend-icon="mdi-account-box" title="Profil"
        ><router-link to="/profile" />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import firebase from "firebase/compat/app";
export default {
  data() {
    return {
      user: null,
    };
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
    });
  },
  methods: {
    signoutButtonPressed(e) {
      e.stopPropagation();
      firebase.auth().signOut();
      this.$router.push({ name: "Login" });
    },
  },
};
</script>
