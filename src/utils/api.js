import axios from "axios";

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
});

/**
 * Interceptors
 */
// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    window.alert("Internet is required to use this app.");
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

/**
 * Rooms
 */

export function createRoom(datas, success, error) {
  const name = datas.name;
  const description = datas.description;
  const radius = datas.radius;
  const color = datas.color;
  const lat = datas.lat;
  const lng = datas.lng;
  const createdBy = datas.createdBy;

  if (
    !name ||
    !description ||
    !radius ||
    !color ||
    !lat ||
    !lng ||
    !color ||
    !createdBy
  )
    return;

  // Create room into our personal API
  const data = {
    createdBy: createdBy,
    name: name,
    description: description,
    radius: radius,
    color: color,
    latitude: lat,
    longitude: lng,
  };

  instance
    .post("chat-room", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      return success(res);
    })
    .catch((err) => {
      console.error("Error:" + error);
      return error(err);
    });
}

export function getAllRooms() {
  return new Promise((resolve, reject) => {
    instance
      .get("chat-room/all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getReachableRooms(longitude, latitude) {
  if (!longitude || !latitude) throw new Error("Missing longitude or latitude");

  return new Promise((resolve, reject) => {
    instance
      .get("chat-room", {
        params: { longitude: longitude, latitude: latitude },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getRoomById(roomUuid) {
  return new Promise((resolve, reject) => {
    instance
      .get(`chat-room/${roomUuid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Direct Links
 */

export function getAllDirectLinks(userUuid) {
  return new Promise((resolve, reject) => {
    instance
      .get("direct-link/all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { me: userUuid },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Users
 */
export function registerUserInfos(user) {
  const formData = {
    uid: user.uid,
    username: user.displayName,
    email: user.email,
    avatarURL: user.photoURL,
  };

  return new Promise((resolve, reject) => {
    instance
      .post("user", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getUserInfos(userUuid) {
  return new Promise((resolve, reject) => {
    instance
      .get(`user/${userUuid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function doILikeThisUser(me, userUuid) {
  return new Promise((resolve, reject) => {
    instance
      .get(`user/is-liked/${me}/${userUuid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function likeAnUser(me, userUuid) {
  const formData = {
    me: me,
    friendUid: userUuid,
  };
  return new Promise((resolve, reject) => {
    instance
      .post(`user/add-friend`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Messages
 */
export function getMessages(roomUuid) {
  return new Promise((resolve, reject) => {
    instance
      .get(`message/${roomUuid}/messages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function storeFile(file) {
  const formData = new FormData();
  formData.append("File", file);
  return new Promise((resolve, reject) => {
    instance
      .post(`message/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
