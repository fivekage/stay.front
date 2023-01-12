<template>
  <GoogleMaps :center="{ ...coordinates }" class="GoogleMaps" />
</template>

<script>
import GoogleMaps from "@/components/Map.vue";
export default {
  data() {
    return {
      coordinates: {
        lat: 49.8366424,
        lng: 3.2996185,
      },
    };
  },
  components: {
    GoogleMaps,
  },
};
</script>

<style>
.GoogleMaps {
  height: 100%;
}
</style>
