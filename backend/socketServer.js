const authSocket = require("./middleware/authSocket");
const disconnectHandler = require("./socketHandlers/disconnectHandler");
const newConnectionHandler = require("./socketHandlers/newConnectionHandler");
const serverStore = require("./serverStore");
const directMessageHandler = require("./socketHandlers/directMessageHandler");
const directChatHistoryHandler = require("./socketHandlers/directChatHistoryHandler.js");
const roomCreateHandler = require("./socketHandlers/roomCreateHandler");
const roomJoinHandler = require("./socketHandlers/roomJoinHandler");
const roomLeaveHandler = require("./socketHandlers/roomLeaveHandler");
const roomInitializeConnectionHandler = require("./socketHandlers/roomInitializeConnectionHandler");

const registerSocketServer = (server) => {
	const io = require("socket.io")(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	serverStore.setSocketServerInstance(io);

	io.use((socket, next) => {
		authSocket(socket, next);
	});

	const emitOnlineUsers = () => {
		const onlineUsers = serverStore.getOnlineUsers();
		io.emit("online-users", { onlineUsers });
	};

	io.on("connection", (socket) => {
		console.log("User connected");
		console.log(socket.id);
		newConnectionHandler(socket, io);
		emitOnlineUsers();

		socket.on("direct-message", (data) => {
			directMessageHandler(socket, data);
		});

		socket.on("direct-chat-history", (data) => {
			directChatHistoryHandler(socket, data);
		});

		socket.on("room-create", () => {
			roomCreateHandler(socket);
		});

		socket.on("room-join", (data) => {
			roomJoinHandler(socket, data);
		});

		socket.on("room-leave", (data) => {
			roomLeaveHandler(socket, data);
		});

		socket.on("conn-init", (data) => {
			roomInitializeConnectionHandler(socket, data);
		});

		socket.on("disconnect", () => {
			disconnectHandler(socket);
		});
	});

	setInterval(() => {
		emitOnlineUsers();
	}, [8000]);
};

module.exports = { registerSocketServer };
