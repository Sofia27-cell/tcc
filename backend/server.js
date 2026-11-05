const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    sistema: "BusLine Company",
    status: "Backend funcionando"
  });
});

app.post("/localizacao", (req, res) => {
  const { latitude, longitude } = req.body;

  if (latitude == null || longitude == null) {
    return res.status(400).json({
      erro: "Latitude e longitude são obrigatórias"
    });
  }

  console.log("Localização recebida:", latitude, longitude);

  res.json({
    mensagem: "Localização recebida com sucesso",
    latitude,
    longitude
  });
});

app.listen(PORT, () => {
  console.log(`BusLine Backend rodando na porta ${PORT}`);
});