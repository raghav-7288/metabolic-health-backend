const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Google Sheets Auth
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json", // Your service account JSON file
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = "18hzRKoQy--Nty3WBusecwU_TZvlXc6pf71w2sgzhd-E"; // Replace with actual Google Sheet ID

app.post("/submit", async (req, res) => {
  const { basicDetails, ffqResponses, pssScore, otherScales } = req.body;

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:E",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            basicDetails.age,
            basicDetails.gender,
            basicDetails.bmi,
            pssScore,
            JSON.stringify(ffqResponses),
          ],
        ],
      },
    });

    res.status(200).json({ message: "Data saved successfully!" });
  } catch (error) {
    console.error("Error writing to Google Sheets:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
