const socketUrl = "ws://localhost:5000/ws";
let socket = {};

let connect = (msgCallback) => {
  console.log("Attempting Connection...");
  socket = new WebSocket(socketUrl + "?id=" + localStorage.getItem("uid"));

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
    console.log("Socket Error: ", error);
  };
};

let sendMsg = (msg) => {
  console.log("Sending msg:", msg);
  socket.send(JSON.stringify(msg));
};

export { connect, sendMsg };
