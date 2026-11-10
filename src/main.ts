import { main } from "./application/Dragomino.js";

process.exitCode = await main(process.argv.slice(2));
