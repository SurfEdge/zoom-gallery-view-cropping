const express = require("express");
const imageToSlices = require("image-to-slices");
const clipper = require("image-clipper");
const canvas = require("canvas");
const app = express();
const port = 3000;

const path = require("path");
const fs = require("fs");

const original_path = path.join(__dirname, "screenshots");

app.get("/", (req, res) => {
  let images = [];
  fs.readdir(original_path, function (err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    files.forEach(function (file) {
      images.push(file);
      console.log(file);
    });
    console.log(images);

    res.json(files);
  });
  // res.send('Hello World!')
});

const cropImage = () => {
  return new Promise((resolve, _) => {
    clipper.configure("canvas", canvas);
    clipper("./zoom.png", function () {
      this.crop(26, 33, 590, 334)
        .quality(100)
        .toFile("./zoom-safe-region.png", function () {
          resolve("done");
        });
    });
  });
};

const sliceImage = () => {
  return new Promise((resolve, _) => {
    const lineX = [];
    const lineY = [];
    // Grid split
    let lineXHeight = 0;
    let lineYWidth = 0;
    for (i = 1; i <= 6; i++) {
      lineXHeight = lineXHeight + 48;
      lineYWidth = lineYWidth + 84;
      lineX.push(lineXHeight);
      lineY.push(lineYWidth);
    }
    imageToSlices.configure({
      clipperOptions: {
        canvas,
      },
    });
    console.log(lineY, lineX);
    var source = "./zoom-safe-region.png";
    imageToSlices(
      source,
      lineX,
      lineY,
      {
        saveToDir: "./images/",
      },
      () => {
        return resolve("done");
      }
    );
  });
};

app.get("/slice-image", async (req, res) => {
  try {
    await cropImage();
    await sliceImage();
    return res.json({ msg: "done" });
  } catch (err) {
    console.log(err);
    return res.statusCode(500).json({ msg: "something went wrong." });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
