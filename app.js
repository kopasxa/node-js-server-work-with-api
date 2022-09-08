const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

app.get("/rates", (req, res) => {
  try {
    axios
        .get(`https://api.coincap.io/v2/rates/${req.query.currency}`)
        .then((resp) => {
            res.json(
                {
                    "usd": resp.data.data.rateUsd
                }
            );
        })
    .catch((error) => {
        res.status(404).send(error);
        console.error(error);
    });
  }
  catch (error) {
    res.status(403).send(error);
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
