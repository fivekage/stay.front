<template>
  <v-card class="mx-auto" max-width="368" elevation="10">
    <div class="mx-auto text-center mt-3">
      <v-avatar
        :image="user.photoURL"
        alt="Photo de profil"
        size="80"
        referrerpolicy="no-referrer"
      >
      </v-avatar>
      <h3 class="mt-3">{{ user.displayName }}</h3>
      <p class="text-caption mt-2">
        {{ user.email }}
      </p>
      <p class="text-caption mt-1">
        {{ user.uid }}
      </p>
      <p class="text-caption mt-1">
        Fourni par "{{ user.providerData[0].providerId }}"
      </p>
    </div>

    <v-divider class="mt-3"></v-divider>

    <v-card-actions>
      <v-btn rounded variant="text" block v-on:click="signoutButtonPressed"
        >Se déconnecter</v-btn
      >
    </v-card-actions>
  </v-card>
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
    const user = firebase.auth().currentUser;
    user.getIdToken(true).then((data) => {
      localStorage.setItem("token", data);
    });
    if (user) {
      this.user = user;
    }
  },
  methods: {
    signoutButtonPressed(e) {
      e.stopPropagation();
      firebase.auth().signOut();
      localStorage.clear();
      this.$router.push({ name: "Login" });
    },
  },
};
</script>
