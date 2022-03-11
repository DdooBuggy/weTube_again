import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

// applications and variables
const PORT = 4000;
const app = express();
const logger = morgan("dev");

// set views
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

// middlewares
app.use(logger);
app.use(express.urlencoded({ extended: true }));

// routers
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

// listening
const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
