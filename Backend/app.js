const express = require("express");
const mysql = require("mysql2/promise"); // Import mysql2
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());


app.get("/", (req, res) => {
    try {
      console.log("aia");
      // Create a JSON payload and send it as the response
      const jsonResponse = {
        message: "oooooooooo",
      };
      res.status(200).json(jsonResponse);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });

app.post("/welcome", (req, res) => {
    try {
      console.log("aia");
      // Create a JSON payload and send it as the response
      const jsonResponse = {
        message: "Welcome",
      };
      res.status(200).json(jsonResponse);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });

app.post("/calcolo", (req, res) => {
    try {
      console.log("sto calcolando...");
      const lat1 = req.body.lat1;
      const lon1 = req.body.lon1;
      const lat2 = req.body.lat2;
      const lon2 = req.body.lon2;


      const R = 6371e3; // metres
      const φ1 = lat1 * Math.PI/180; // φ, λ in radians
      const φ2 = lat2 * Math.PI/180;
      const Δφ = (lat2-lat1) * Math.PI/180;
      const Δλ = (lon2-lon1) * Math.PI/180;
      
      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      
      const d = R * c; // in metres


      res.status(200).json(d);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });



  // Login
app.post("/login", async (req, res) => {
  // Database configuration
  const dbConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  };

  /*console.log(dbConfig.host);
  console.log(dbConfig.user);
  console.log(dbConfig.password);
  console.log(dbConfig.database);*/
  
  // Create a MySQL pool for handling connections
  const pool = mysql.createPool(dbConfig);
  // Our login logic goes here

  console.log(req.body);
  try {
    const { username, password } = req.body;

    console.log(username);
    console.log(password);

    if (username === "" && password === "") {
      return res.status(401).send("Missing credentials");
    } else {
      if (username === "") {
        return res.status(401).send("Missing username");
      } else {
        if (password === "") {
          return res.status(401).send("Missing password");
        }
      }
    }

    // await pool.query("USE autenticazione");
    // Seconda query: SELECT * FROM utente WHERE username = 'm'
    const [rows] = await pool.execute(
      "SELECT * FROM utente WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).send("User not found, please Sign In");
    }

    const user = rows[0];

    console.log(user);

    // Check if the provided password matches the stored hashed password
    const passwordMatch = password === user.Password;

    if (!passwordMatch) {
      return res.status(401).send("Invalid Password");
    }

    /*const [rowz] = await pool.execute(
      "SELECT IDUtente FROM utente WHERE username = ?",
      [username]
    );
    if (rowz.length > 0) {
      userId = rowz[0].id__utente;
      console.log(userId);
      uppy();
    } else {
      console.log("unlucky non esiste");
    }*/

    res.status(200).json({username, message: "Login effettuato" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});



  module.exports = app;