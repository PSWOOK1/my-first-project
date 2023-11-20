const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const userRouter = require("./routers/user.js");
// const productRouter = require("./routers/products.js");

app.use(express.json());
app.use(cookieParser());
app.listen(3000, () => {
  console.log("서버가 실행되었습니다.");
});

app.get("/", (req, res) => {
  res.send("다형님 최고");
});

app.use("/api", [userRouter]);
