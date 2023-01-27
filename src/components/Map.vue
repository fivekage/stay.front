<!-- this bad boy bein doin wonders... https://dev.to/alfchee/create-a-simple-vue-component-to-use-google-maps-4keh -->

<template>
  <div class="map" ref="map"></div>
  <v-btn
    @click.stop="drawer = !drawer"
    prepend-icon="mdi-chevron-double-up"
    rounded
    class="map__button"
  >
    Salons accessibles
  </v-btn>
  <v-navigation-drawer location="bottom" v-model="drawer" temporary>
    <v-divider></v-divider>
    <v-list dense>
      <v-list-subheader>Salons accessibles</v-list-subheader>
      <v-virtual-scroll :height="150">
        <v-list-item-group color="primary">
          <v-list-item v-for="(item, i) in items" :key="i">
            <template v-slot:prepend>
              <v-list-item-icon>
                <v-icon :color="item.color" icon="mdi-circle"></v-icon>
              </v-list-item-icon>
            </template>

            <v-list-item-title
              class="px-3"
              v-text="item.title"
            ></v-list-item-title>
            <v-spacer></v-spacer>
            <template v-slot:append>
              <div class="d-flex mr-3">
                <p class="px-1 font-weight-medium text-caption">
                  {{ item.usersConnected }}
                </p>
                <v-icon
                  color="blue-grey"
                  icon="mdi-account-group"
                  variant="text"
                ></v-icon>
              </div>

              <p
                class="text-medium-emphasis font-weight-medium text-caption"
                v-if="item.radius < 1000"
              >
                {{ item.radius.toFixed(1) }} m
              </p>
              <p
                class="text-medium-emphasis font-weight-medium text-caption"
                v-else
              >
                {{ (item.radius / 1000).toFixed(1) }} km
              </p>
            </template>
          </v-list-item>
        </v-list-item-group>
      </v-virtual-scroll>
    </v-list>

    <v-dialog v-model="dialog">
      <template v-slot:activator="{ props }">
        <div class="d-flex justify-center py-3">
          <v-btn v-bind="props" icon="mdi-plus" color="primary"></v-btn>
        </div>
      </template>
      <AddRoom @submit-form="submitForm" />
    </v-dialog>
  </v-navigation-drawer>
</template>

<script>
import gmapsInit from "@/utils/gmaps";
import getLocation from "@/utils/getLocation";
import AddRoom from "./AddRoom.vue";
import { getAllRooms } from "@/utils/api";

export default {
  name: "GoogleMaps",
  components: {
    AddRoom,
  },
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
      drawer: null,
      dialog: false,
      items: [],
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
  beforeMount() {
    this.initRooms();
  },
  methods: {
    submitForm(data) {
      this.dialog = data;
      this.initRooms();
    },
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
    addCircle(location, radius, color) {
      console.log("addCircle", location, radius, color);
      // the circle positioned at `myLocation`
      const circle = new this.google.maps.Circle({
        map: this.map,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35,
        center: location,
        radius: radius,
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
    initRooms() {
      getAllRooms()
        .then((res) => {
          this.items = res.data.map((room) => {
            return {
              title: room.value.name,
              value: room.key.toString(),
              color: room.value.color,
              radius: room.value.radius,
              usersConnected: 13,
              latitude: room.value.latitude,
              longitude: room.value.longitude,
            };
          });
          // add the circles to the map
          console.log(this.items);
          this.items.forEach((element) => {
            console.log(element);
            this.addCircle(
              {
                lat: parseFloat(element.latitude),
                lng: parseFloat(element.longitude),
              },
              element.radius,
              element.color
            );
          });
          this.setAllCirclesInMap(this.map);
        })
        .catch((err) => {
          console.error("erreur récupération rooms: ", err);
        });
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
  min-height: 100vh;
  position: unset !important;
  overflow: auto !important;
}

.map__button {
  position: sticky;
  bottom: 1.4rem;
  width: 90%;
}

.v-main__scroller {
  overflow: hidden !important;
}
</style>
