import express from "express";
import helmet from "helmet";
import fs from "node:fs";

const app = express();
app.use(helmet());
app.use(express.json());

const ROUTE = "commands";

const filePath = "/app/commands.txt";
const filePath2 = "/app/memory.txt";

app.get(`/${ROUTE}`, (req, res) => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    res.json({ text: data });
  } else {
    res.status(404).send("File not found");
  }
});

app.post(`/${ROUTE}`, (req, res) => {
  try {
    fs.appendFileSync(filePath, req.body.commands + "\n", "utf8");
    fs.appendFileSync(filePath2, req.body.commands + "\n", "utf8");
  } catch (error) {
    console.error("Error writing to file:", error);
    return res.status(500).send("Error writing to file");
  }
  res.status(200).send("File saved successfully!");
});

app.get(`/${ROUTE}/list`, (req, res) => {
  if (fs.existsSync(filePath2)) {
    const data = fs.readFileSync(filePath2, "utf8");
    res.json({ text: data });
  } else {
    res.status(404).send("File not found");
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
