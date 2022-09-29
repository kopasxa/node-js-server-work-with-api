const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

var response_data = {
  data: [],
  timestamp: 0,
};

function check(response_data, req, res) {
  if (response_data.data.map((e) => e.symbol).includes(req.query.currency)) {
    item = response_data.data.filter((e) => e.symbol === req.query.currency)[0];
    res.send(
      {
        "usd": item.rateUsd,
      }
    );
  }
  else {
    res.status(404).send(
      {
        "error": "Currency not found",
      }
    );
  }
}

app.get("/rates", (req, res) => {
  if (!req.query.currency) {
    res.status(400).send(
      {
        "error": "Please provide a currency",
      }
    );
    return;
  }

  try {
    if (response_data.data == [] || response_data.timestamp + 60 < Math.floor(Date.now() / 1000)) { // Предотвращение частых запросов к API
      axios
        .get(`https://api.coincap.io/v2/rates/`)
        .then((resp) => {
          response_data.timestamp = resp.data.timestamp;
          resp.data.data.forEach((e) => {
            response_data.data.push({
              symbol: e.id,
              rateUsd: e.rateUsd,
            });
          });

          check(response_data, req, res);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
      check(response_data, req, res);
    }
  } catch (error) {
    res.status(403).send(error);
    console.error(error);
  }
});

app.get("*", (req, res) => {
  res.status(403).send("Bad request");
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
