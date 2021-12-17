
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const db = require("./_helpers/db");

const routes = require("./routes/userRoutes");


const app = express();


app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/users", routes);






const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));
db();