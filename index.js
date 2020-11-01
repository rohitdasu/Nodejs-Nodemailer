const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cors = require("cors");


const emailRoute = require("./routes/email/email")

const port = 3000 || process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


app.use("/api/form",emailRoute);


app.get("/", (req, res) => {
  res.status(200).send("Hello User!");
});


app.listen(port, () => {
  console.log(`app listening at port ${port}`);
});
