import Server from "./server";
import { resetFiles } from "./utils/file-io";


const server = new Server(5000)

console.log(process.argv)
if (process.argv[2] === "reset") {
    resetFiles()
    console.log("Reseting data files...")
}

server.run();