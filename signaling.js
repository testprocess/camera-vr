export async function socket (io) {
    io.on("connection", (socket) => {

        socket.emit("connected", "player")

    });
}