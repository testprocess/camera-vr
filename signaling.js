export async function socket (io) {
    io.on("connection", (socket) => {

        console.log("E")

        socket.on("test", () => {
            console.log("OTT")

        })

        


        socket.on("newIceCandidate", (message) => {
            console.log("OKT")

            io.emit("iceCandidate", message)
        })


        socket.on("answer", (message) => {
            console.log("answer")

            io.emit("message", message)
        })

        socket.on("offer", (message) => {
            console.log("offer")

            io.emit("messageoffer", message)
        })
        

    });
}