<template>
  <nav>
    <div class="nav-wrapper">
      <!-- <a href="#" class="brand-logo">Logo</a> -->
      <router-link to="/" class="brand-logo">Home</router-link>

      <ul>
        <li v-show="!user">
          <router-link to="/login">Login</router-link>
        </li>
        <li v-show="user">
          <router-link to="/profile">Profile</router-link>
        </li>
        <li v-show="user">
          <a @click="signoutButtonPressed">Logout</a>
        </li>
      </ul>
    </div>
  </nav>
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
