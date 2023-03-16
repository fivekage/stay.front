<template>
  <v-app id="app">
    <v-app-bar color="grey-lighten-2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title><logo /></v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer color="grey-darken" v-model="drawer">
      <v-list>
        <v-list-item
          v-show="user"
          prepend-icon="mdi-map"
          title="Carte"
          to="/"
        ></v-list-item>

        <v-list-item
          v-show="user"
          prepend-icon="mdi-forum"
          title="Liens directs"
          to="/direct"
        ></v-list-item>
        <v-list-item
          v-show="!user"
          prepend-icon="mdi-account-box"
          title="Se connecter"
          to="/login"
        ></v-list-item>

        <v-list-item
          v-show="user"
          prepend-icon="mdi-account-box"
          title="Profil"
          to="/profile"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main scrollable>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import logo from "@/components/Logo.vue";
import firebase from "firebase/compat/app";
export default {
  data() {
    return {
      drawer: null,
      user: null,
    };
  },
  components: {
    logo,
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

<style lang="scss">
.v-app-bar-title {
  display: flex;

  & > div {
    display: contents;
  }
}

.v-main .v-container {
  min-height: 100%;
}
</style>
