const axios = require("axios");
const fs = require("fs");
const progress = require("progress");

const url = "https://ash-speed.hetzner.com/1GB.bin";
const outputFile = "tes.mp3";

const downloadFile = async () => {
  const startTime = new Date();
  const response = await axios({
    url,
    method: "get",
    headers: {
      range: "bytes=0-",
    },
    responseType: "stream",
  });

  const totalLength = parseInt(response.headers["content-length"], 10);
  let downloadedLength = 0;
  let lastDownloadedLength = 0;
  let lastSpeed = 0;
  let speeds = [];
  let maxSpeed = 0;
  let minSpeed = Infinity;

  const progressBar = new progress("[:bar] :percent :etas Speed: :speed/Mbps", {
    complete: "=",
    incomplete: " ",
    width: 50,
    total: totalLength,
  });

  const speedInterval = setInterval(() => {
    const speed = ((downloadedLength - lastDownloadedLength) / 1000 / 1000) * 8; // in Mbps
    lastSpeed = speed;
    lastDownloadedLength = downloadedLength;
    maxSpeed = Math.max(maxSpeed, speed);
    minSpeed = Math.min(minSpeed, speed);

    // Menambahkan nilai kecepatan ke dalam array
    speeds.push(speed);
  }, 1000);

  response.data
    .on("data", (chunk) => {
      downloadedLength += chunk.length;
      progressBar.tick(chunk.length, { speed: lastSpeed.toFixed(2) });
    })
    .on("end", () => {
      clearInterval(speedInterval);
      const endTime = new Date();
      const elapsedTime = (endTime - startTime) / 1000 / 60;

      // Menghitung rata-rata dari semua nilai kecepatan yang diukur
      const averageSpeed =
        speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;

      console.log("Sudah Terdownload ✓");
      console.log(`Selesai dalam ${elapsedTime.toFixed(2)} menit`);
      console.log(`Ukuran File: ${downloadedLength / 1000 / 1000} MB`);
      console.log(`Kecepatan Rata-rata: ${averageSpeed.toFixed(2)} Mbps`);
      console.log(`Kecepatan Tertinggi: ${maxSpeed.toFixed(2)} Mbps`);
      console.log(`Kecepatan Terendah: ${minSpeed.toFixed(2)} Mbps`);
    });

  response.data.pipe(fs.createWriteStream(outputFile));
};

downloadFile();
