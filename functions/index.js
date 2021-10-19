const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const Twitter = require("twitter");
const express = require("express");
const fs = require("fs");
const app = express();
const port = 8000;
const axios = require("axios");
const db = require("./firebase");
const { collection, getDocs } = require("firebase/firestore");

const twitterClient = new Twitter({
  consumer_key: "umlgr3jxEO0uZIEjR4R77566y", //YCttnrIs237tVMqKVinUdceh2
  consumer_secret: "qd3ctTzIPo67NSSKQEb4qJiNqUYRvq3ex7Yk8e8LuMP2bzd8Ha", //HmqZJBCVpNvBvYQk3m5CbLRXYvhVWXndX5QpHgTmtZKkFReIIZ
  access_token_key: "1448587539325984769-SrQD5vq3ygvnqhmIxSKb8raTQjmnn5", //1448587539325984769-Le6GlVA6GLyRVQxDO1rAXzmfyt7XSR
  access_token_secret: "vLk93fuepuUDX4p5rbIhsKoOZRnE5ocyKF36vlnFefm0G", //bJ6ERApUeuKjptaixfiaFcZYrzr0r6lw1h0GcsBvswD7u
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(express.json());
app.get("/postimage/twitter/:caption/:image", async (req, res) => {
  let { caption, image } = req.params;
  getDocs(collection(db, "images")).then((data) => {
    image = image.slice(1, image.length - 1);
    data.forEach(async (doc) => {
      if (doc.id === image) {
        const response = await axios.get(doc.data().url, {
          responseType: "arraybuffer",
        });
        const buffer = Buffer.from(response.data, "utf-8");
        twitterClient.post(
          "media/upload",
          { media: buffer },
          function (error, media, response) {
            if (!error) {
              var status = {
                status: caption,
                media_ids: media.media_id_string, // Pass the media id string
              };
              twitterClient.post(
                "statuses/update",
                status,
                function (error, tweet, response) {
                  res.send(response);
                }
              );
            } else {
              console.log(error);
            }
          }
        );
      }
    });
  });
});
app.get("/posttext/twitter/:text", (req, res) => {
  const { text } = req.params;
  twitterClient.post(
    "statuses/update",
    { status: text },
    function (error, tweet, response) {
      res.send(response);
    }
  );
});
app.get("/", (req,res) => {
    res.send("hello world")
})
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

exports.app = functions.https.onRequest(app);