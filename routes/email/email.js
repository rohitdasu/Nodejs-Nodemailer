const express = require("express");
const router = express.Router();
const Joi = require("joi");
var nodemailer = require("nodemailer");
const config = require("config");

const emailConfig = config.get("app.emailConfig");

router.post("/submit", async (req, res, next) => {
  const formSchema = Joi.object().keys({
    fullname: Joi.string().required(),
    organisation_name: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }),
    phone: Joi.number().required(),
    business_category: Joi.string().required(),
    interested_in: Joi.string().required(),
    message: Joi.string().required(),
  });

  const result = formSchema.validate(req.body);
  const { value, error } = result;
  const valid = error == null;

  let phone_length = req.body.phone.length;

  if (phone_length < 10) {
    res.status(400).json({ success: false, error: "invalid entry" });
    return;
  }

  if (!valid) {
    res.status(400).json({ error: error, success: false });
    return;
  } else {
    let transporter = nodemailer.createTransport({
      service: emailConfig.service_provider,
      auth: {
        user: emailConfig.email,
        pass: emailConfig.password,
      },
    });

    mailOption = {
      from: emailConfig.email,
      to: emailConfig.target,
      subject: `A new form submitted by ${req.body.fullname}`,
      // text: `${req.body}`,
      html: `<!DOCTYPE html>
      <html>
      <head>
      <style>
      table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }
      
      td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }
      
      tr:nth-child(even) {
        background-color: #dddddd;
      }
      </style>
      </head>
      <body>
      
      <h2>Nearbuzz</h2>
      
      <table>
        <tr>
          <th>Full Name</th>
          <th>Organisation Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Business Category</th>
          <th>Interested in</th>
          <th>Message</th>
        </tr>
        <tr>
          <td>${req.body.fullname}</td>
          <td>${req.body.organisation_name}</td>
          <td>${req.body.email}</td>
          <td>${req.body.phone}</td>
          <td>${req.body.business_category}</td>
          <td>${req.body.interested_in}</td>
          <td>${req.body.message}</td>
        </tr>
       
      </table>
      
      </body>
      </html>`,
    };

    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false });
      } else {
        console.log("Mail Sent");
        res.status(200).json({ success: true });
      }
    });
  }
});

module.exports = router;

