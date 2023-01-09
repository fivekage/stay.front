<template>
  <v-app id="app">
    <v-app-bar color="grey-lighten-2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title><logo /></v-app-bar-title>
    </v-app-bar>

    <customNavDrawer></customNavDrawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import logo from "@/components/Logo.vue";
import customNavDrawer from "@/components/NavDrawer.vue";
export default {
  data() {
    return {
      drawer: null,
    };
  },
  components: {
    logo,
    customNavDrawer,
  },
};
</script>

<style>
.v-app-bar-title {
  display: flex;
}
.v-app-bar-title > div {
  display: contents;
}
</style>
