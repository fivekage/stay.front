<!-- this bad boy bein doin wonders... https://dev.to/alfchee/create-a-simple-vue-component-to-use-google-maps-4keh -->

<template>
  <div class="map" ref="map"></div>
</template>

<script>
import gmapsInit from "@/utils/gmaps";
import getLocation from "@/utils/getLocation";

export default {
  name: "GoogleMaps",
  props: {
    center: {
      type: Object,
      required: true,
    },
    circles: {
      type: Array,
    },
  },
  async mounted() {
    try {
      // init and wait for the Google script is mounted
      this.google = await gmapsInit();
      this.drawMap();

      // get the current location
      getLocation(this.setUserMarker, function () {
        console.error("Cannot get location.");
      });
    } catch (err) {
      console.log("ERROR:", err);
    }
  },
  data() {
    return {
      google: null,
      map: null,
      innerCircles: [],
      userMarker: null,
    };
  },
  computed: {
    myLocation() {
      // if the coordinates is not set
      if (!("lat" in this.center) && typeof this.center.lat !== "number") {
        return null;
      }
      // return the object expected by Google Maps
      return { lat: this.center.lat, lng: this.center.lng };
    },
  },
  methods: {
    drawMap() {
      if (this.myLocation.lat && this.myLocation.lng) {
        // creating the map object, displaying it in the $el DOM object
        this.map = new this.google.maps.Map(this.$refs["map"], {
          zoom: 18,
          center: this.myLocation,
        });

        // center the canvas of the map to the location of the user
        this.map.setCenter(this.myLocation);
      }
    },
    // add a circle with a blue dot to indicate the user location
    setUserMarker(location) {
      this.userMarker = new this.google.maps.Marker({
        position: new this.google.maps.LatLng(
          location.coords.latitude,
          location.coords.longitude
        ),
        map: this.map,
        icon: {
          path: this.google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#FFF",
        },
      });
      this.centerMap(
        new this.google.maps.LatLng(
          location.coords.latitude,
          location.coords.longitude
        )
      );
    },
    // Adds a circle to the map and push to the array
    addCircle(location) {
      // the circle positioned at `myLocation`
      const circle = new this.google.maps.Circle({
        position: location,
        map: this.map,
      });
      this.innerCircles.push(circle);
    },
    // Sets the map on all circles in the array
    setAllCirclesInMap(map) {
      for (const element of this.innerCircles) {
        element.setMap(map);
      }
    },
    // Removes the circles from the map, but keeps them in the array
    clearCircles() {
      this.setAllCirclesInMap(null);
    },
    // Deletes all circles in the array by removing references to them
    deleteCircles() {
      this.clearCircles();
      this.innerCircles = [];
    },
    // Center the map to the given location
    centerMap(location) {
      this.map.panTo(location);
    },
  },
  watch: {
    circle: function (newVal) {
      if (typeof newVal === Array) {
        // clear the circles
        this.clearCircles();

        for (const position of newVal) {
          if (
            "lat" in position &&
            typeof position.lat === "number" &&
            typeof position.lng === "number"
          ) {
            // set the current location
            this.addCircle(position);
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.map {
  width: 100%;
  min-height: 500px;
  max-height: 100%;
}
</style>
