const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const JSON_FILE = "repertorio.json";

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/canciones", (req, res) => {
  fs.readFile(JSON_FILE, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error al leer el archivo" });
    }
    res.json(JSON.parse(data));
  });
});

app.post("/canciones", (req, res) => {
  const nuevaCancion = req.body;

  fs.readFile(JSON_FILE, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error al leer el archivo" });
    }

    let canciones = JSON.parse(data);
    canciones.push(nuevaCancion);

    fs.writeFile(JSON_FILE, JSON.stringify(canciones, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Error al escribir el archivo" });
      }
      res.status(201).json({ message: "Canción agregada", cancion: nuevaCancion });
    });
  });
});

app.put("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const cancionEditada = req.body;

  fs.readFile(JSON_FILE, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error al leer el archivo" });
    }

    let canciones = JSON.parse(data);
    const index = canciones.findIndex((cancion) => cancion.id == id);

    if (index === -1) {
      return res.status(404).json({ message: "Canción no encontrada" });
    }

    canciones[index] = cancionEditada;

    fs.writeFile(JSON_FILE, JSON.stringify(canciones, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Error al escribir el archivo" });
      }
      res.json({ message: "Canción editada", cancion: cancionEditada });
    });
  });
});

app.delete("/canciones/:id", (req, res) => {
  const { id } = req.params;

  fs.readFile(JSON_FILE, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error al leer el archivo" });
    }

    let canciones = JSON.parse(data);
    canciones = canciones.filter((cancion) => cancion.id != id);

    fs.writeFile(JSON_FILE, JSON.stringify(canciones, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Error al escribir el archivo" });
      }
      res.json({ message: "Canción eliminada" });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
