require("dotenv").config();
const express = require("express");
const app = express();

const api = require("./routers/api");
const connection = require("./connection");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", api);
// app.use((req, res) => {
//     res.status(404).json({ status: false, message: "404_NOT_FOUND" });
// });

connection();

app.listen(process.env.PORT, () => {
    console.log(`Server started on http://localhost:${process.env.PORT}`);
});
