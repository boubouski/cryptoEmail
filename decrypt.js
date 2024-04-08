const express = require("express");
require("dotenv").config();
const nodemailer = require("nodemailer");
const ejsMate = require("ejs-mate");

const app = express();

// parse application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
  res.render("main.ejs");
});

app.post("/", async (req, res) => {
  cipher = req.body.cipherName;
  studentName = req.body.studentName;
  cipherAns = req.body.answer;

  console.log(cipherAns);
  result = false;

  sendEmail = async function (studentName, cipher) {
    let transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "apikey", // ethereal user
        pass: process.env.SEND_EMAIL_PASS, // ethereal password
      },
    });

    const msg = {
      from: process.env.FROM_EMAIL, // sender address
      to: process.env.TO_EMAIL, // list of receivers
      subject: "Response", // Subject line
      text: `${studentName} got the ${cipher} question right`, // plain text body
    };
    // send mail with defined transport object
    const info = await transporter.sendMail(msg);
  };

  if (cipher == "Rsa") {
    if (cipherAns == 123) {
      result = true;
      sendEmail(studentName, cipher);
      console.log("email sent");
    }
  } else if (cipher == "Caesar") {
    if (cipherAns == "msg") {
      result = true;
      sendEmail(studentName, cipher);
      console.log("email sent");
    }
  }

  res.send({ result });
});

app.listen(3000, () => console.log("listening on port 3000"));
