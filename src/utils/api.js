import axios from "axios";

const instance = axios.create({
  baseURL: "https://localhost:5001/api/",
  headers: localStorage.getItem("token"),
});

export function createRoom(datas, success, error) {
  const name = datas.name;
  const description = datas.description;
  const radius = datas.radius;
  const color = datas.color;
  const lat = datas.lat;
  const lng = datas.lng;
  const uid = datas.uid;
  const createdBy = datas.createdBy;

  if (
    !name ||
    !description ||
    !radius ||
    !color ||
    !lat ||
    !lng ||
    !color ||
    !uid ||
    !createdBy
  )
    return;

  // Create room into our personal API
  const data = {
    uid: uid,
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
