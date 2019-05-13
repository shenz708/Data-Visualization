const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const AYLIENTextAPI = require("aylien_textapi");
const path = require("path");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, "static")));
const textapi = new AYLIENTextAPI({
  application_id: "5b601434",
  application_key: "f47a578967daf2462401204f3d4a53e9"
});

app.post("/concepts", async function(req, res) {
  const { text } = req.body;
  textapi.concepts(
    {
      text
    },
    function(error, response) {
      if (error === null) {
        console.log(JSON.stringify(response));
        res.json({
          status: 0,
          data: response
        });
        return;
      }
      res.json({
        status: -1
      });
    }
  );
});

const http = require("http");
const PORT = 3000;

http.createServer(app).listen(PORT, function() {
  console.log("HTTP server on http://localhost:3000");
});
