const connectedUsers = new Map();

let io = null;

const setSocketServerInstance = (ioInstance) => {
	io = ioInstance;
};

const getSocketServerInstance = () => {
	return io;
};

const addNewConnectedUser = ({ socketId, userId }) => {
	connectedUsers.set(socketId, { userId });
	console.log("new connected users");
	console.log(connectedUsers);
};

const getActiveConnections = (userId) => {
	const activeConnections = [];

	connectedUsers.forEach(function (value, key) {
		if (value.userId === userId) {
			activeConnections.push(key);
		}
	});

	return activeConnections;
};

const removeConnectedUser = (socketId) => {
	if (connectedUsers.has(socketId)) {
		connectedUsers.delete(socketId);
		console.log("New connected users");
		console.log(connectedUsers);
	}
};

module.exports = {
	addNewConnectedUser,
	removeConnectedUser,
	getActiveConnections,
	setSocketServerInstance,
	getSocketServerInstance,
};
