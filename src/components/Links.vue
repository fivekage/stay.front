<template>
  <v-progress-circular
    class="mx-5 my-5 loader"
    v-if="items == null"
    indeterminate
    color="orange"
    :size="80"
    :width="8"
  ></v-progress-circular>
  <v-list lines="one">
    <Link
      v-for="item in items"
      :key="item.id"
      :userUuid="item.uuid"
      :username="item.username"
      :photo="test"
    />
  </v-list>
</template>

<script>
import Link from "./Link.vue";
import { getAllDirectLinks } from "@/utils/api";
import firebase from "firebase/compat/app";

/* get links item with api and set it to data var */
export default {
  name: "Links",
  components: {
    Link,
  },
  data() {
    return {
      user: null,
      items: null,
    };
  },
  beforeMount() {
    this.user = firebase.auth().currentUser;
  },
  async mounted() {
    this.fetchLinks();
  },
  methods: {
    fetchLinks() {
      getAllDirectLinks(this.user.uid)
        .then((res) => {
          this.items = res.data.map((link) => {
            return {
              uuid: link.userUuid,
              username: link.username ?? "Anonymous",
              photo:
                link.avatar ??
                "https://cdn.vuetifyjs.com/images/cards/foster.jpg",
            };
          });
        })
        .catch((err) => {
          console.error("erreur récupération rooms: ", err);
        });
    },
  },
};
</script>

<style scoped>
.loader {
  width: 100%;
}
</style>
