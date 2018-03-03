const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { check, validationResult } = require("express-validator/check");
const { sanitize } = require("express-validator/filter");
require("dotenv").config();
const port = process.env.PORT;
const gmail_pwd = process.env.GMAIL_PWD;

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tetsuya.chicago@gmail.com",
    pass: gmail_pwd
  }
});

app.post(
  "/inquiry",
  [
    check("email")
      .isEmail()
      .withMessage("Email is not valid!")
      .trim()
      .normalizeEmail(),
    check("subject")
      .isLength({ min: 1 })
      .withMessage("You must supply a subject!")
      .trim(),
    sanitize("subject"),
    check("text")
      .isLength({ min: 1 })
      .withMessage("Text Cannot be Blank!")
      .trim(),
    sanitize("text")
  ],
  (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length !== 0) {
      res.json({ expressValidator: errors });
      return;
    }

    const inquiryMailOptions = {
      from: "tetsuya.chicago@gmail.com",
      to: "tetsuya.chicago@gmail.com",
      subject: req.body.subject,
      text: `from ${req.body.email}: ${req.body.text}`
    };

    const confirmMailOptions = {
      from: "tetsuya.chicago@gmail.com",
      to: req.body.email,
      subject: "Thank you for your inquiry!",
      text: "Your inquiry will be answered soon."
    };

    transporter.sendMail(inquiryMailOptions, function(error, info) {
      if (error) {
        next(error);
      } else {
        transporter.sendMail(confirmMailOptions, function(error, info) {
          if (error) {
            next(error);
          } else {
            res.json("success");
          }
        });
      }
    });
  }
);

app.use((err, req, res, next) => {
  res.json(err);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});