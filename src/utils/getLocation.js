// test for geolocation support, provide geolocation settings, determine location of the user"s device

if (!("geolocation" in navigator)) {
  alert("No geolocation available!");
}

const geoSettings = {
  enableHighAccuracy: false,
  maximumAge: 30000,
  timeout: 20000,
};

// Start everything off
export default function handlePermission(successCallback, errorCallback) {
  navigator.permissions.query({ name: "geolocation" }).then(function (result) {
    if (result.state == "granted") {
      report(result.state);
      navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback,
        geoSettings
      );
    } else if (result.state == "prompt") {
      report(result.state);
    } else if (result.state == "denied") {
      report(result.state);
    }
    result.onchange = function () {
      report(result.state);
    };
  });
}

function report(state) {
  console.log("Permission: " + state);
}
