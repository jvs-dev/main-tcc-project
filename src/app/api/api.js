const express = require("express");
const path = require("path");
const cors = require("cors")

const app = express();

app.use(cors());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname)));

app.post("/login", async (req, res) => {
   try {
      return res.status(200).json({
         result: true,
      });

   } catch (error) {
      return res.status(500).json({
         message: "Falha na comunicação com o servidor!",
         error: String(error)
      });
   }
});

app.get("/vehicles", (req, res) => {
   try {
      return res.status(200).json({ result: true });

   } catch (error) {
      return res.status(500).json({
         message: "Falha na comunicação com o servidor!"
      });
   }
});

app.post("/vehicleData", (req, res) => {
   try {
      return res.status(200).json({ result: true });

   } catch (error) {
      return res.status(500).json({
         message: "Falha na comunicação com o servidor!"
      });
   }
})

app.listen(3001, () => {
   console.log("API running on http://localhost:3001/");
});