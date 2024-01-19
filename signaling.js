export async function socket (io) {
    io.on("connection", (socket) => {
        socket.on("test", () => {
            console.log("OTT")

        })

        socket.on("newIceCandidate", (message) => {
            io.emit("iceCandidate", message)
        })

        socket.on("answer", (message) => {
            io.emit("message", message)
        })

        socket.on("offer", (message) => {
            io.emit("messageoffer", message)
        })
    
    });
}