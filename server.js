const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
// Require 'dotenv' in development mode
if (process.env.NODE_ENV !== "production") require("dotenv").config();

// Get driver connection
const dbo = require("./database/connection");
const photos = require("./controllers/photos/photos");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/photos", photos.getPhotos(dbo));

// multer().none - middleware for decoding text-only multipart
app.post(
  "/photo/add",
  multer().none(),
  body("label").not().isEmpty().trim().escape(),
  body("photoURL").isURL(),
  photos.addPhoto(dbo, validationResult)
);

app.delete("/photo/:id", photos.deletePhoto(dbo));

app.listen(PORT, () => {
  // Perform database connection when server starts
  dbo.connectToServer((error) => {
    if (error) throw new Error(error);
  });

  console.log(`App is listening to port ${PORT}`);
});
