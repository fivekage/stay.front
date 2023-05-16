<template>
  <v-progress-circular
    class="mx-5 my-5 loader"
    v-if="links == null"
    indeterminate
    color="orange"
    :size="80"
    :width="8"
  ></v-progress-circular>
  <v-list lines="one" v-else-if="links.length === 0">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-center">
          Vous n'avez pas de liens directs
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
  <v-list lines="one">
    <Link
      v-for="item in links"
      :key="item.guid"
      :roomGuid="item.guid"
      :user="item.user"
    />
  </v-list>
</template>

<script>
import Link from "./Link.vue";
import { getAllDirectLinks, getUserInfos } from "@/utils/api";
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
      links: null,
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
        .then(async (res) => {
          this.links = await Promise.all(
            res.data.map(async (link) => {
              const to = link.members.find((m) => m !== this.user.uid);
              const friend = await getUserInfos(to);
              return {
                guid: link.guid,
                user: friend.data,
              };
            })
          );
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
