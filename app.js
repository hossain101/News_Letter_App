const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();
//console.log(process.env.API_TOKEN);
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", (_req, _res) => {
  _res.sendFile(__dirname + "/signup.html");
});

app.post("/", (_req, _res) => {
  var firstName = _req.body.firstName;
  var lastName = _req.body.lastName;
  var email = _req.body.email;

  //   const client = require("@mailchimp/mailchimp_marketing");

  //   client.setConfig({
  //     apiKey: "9389d57e853038a3b63feb207c5bf3d8-us14",
  //     server: "us14",
  //   });

  //   const run = async () => {
  //     const response = await client.lists.addListMember("0339d06b88", {
  //       email_address: email,
  //       status: "subscribed",
  //       merge_fields: {
  //         FNAME: firstName,
  //         LNAME: lastName,
  //       },
  //     });
  //     console.log(response);
  //   };

  //   run();

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = `https://us14.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}`;

  const options = {
    method: "POST",
    auth: `auth:${process.env.API_TOKEN}`,
  };

  const request = https.request(url, options, (response) => {
    try {
      if (!process.env.API_TOKEN) {
        throw new Error("API_TOKEN not found");
      }

      if (response.statusCode === 200) {
        _res.sendFile(__dirname + "/success.html");
      } else {
        _res.sendFile(__dirname + "/failure.html");
      }

      response.on("data", (data) => {
        console.log(JSON.parse(data));
      });
    } catch (err) {
      console.error(err);
      _res.send(err.message);
    }
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (_req, _res) => {  
  _res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


