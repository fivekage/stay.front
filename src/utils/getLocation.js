// test for geolocation support, provide geolocation settings, determine location of the user"s device

if (!("geolocation" in navigator)) {
  alert("No geolocation available!");
}

const geoSettings = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 20000,
};

// Start everything off
export default function handlePermission(successCallback, errorCallback) {
  navigator.geolocation.getCurrentPosition(
    successCallback,
    errorCallback,
    geoSettings
  );
}
