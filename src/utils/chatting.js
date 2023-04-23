const socketUrl = process.env.VUE_APP_CHATTING_API;
let socket = {};

let connect = (msgCallback) => {
  console.log("Attempting Connection...");
  socket = new WebSocket(
    socketUrl +
      "?id=" +
      localStorage.getItem("uid") +
      "&token=" +
      localStorage.getItem("token")
  );

  socket.onopen = () => {
    console.log("Successfully Connected");
  };

  socket.onmessage = (msg) => {
    console.log("Received msg:", msg.data);
    msgCallback(JSON.parse(msg.data));
  };

  socket.onclose = (event) => {
    console.log("Socket Closed Connection: ", event);
  };

  socket.onerror = (error) => {
    console.error("Socket Error: ", error);
  };
};

let sendMsg = (msg) => {
  console.log("Sending msg:", msg);
  socket.send(JSON.stringify(msg));
};

let disconnect = () => {
  console.log("Disconnecting socket...");
  socket.close();
};

export { connect, sendMsg, disconnect };
