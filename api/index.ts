import express from "express";
import helmet from "helmet";
import fs from "node:fs";

const app = express();
app.use(helmet());
app.use(express.json());

const ROUTE = "commands";

const filePath = "./commands.txt";
app.get(`/${ROUTE}`, (req, res) => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    res.json({ text: data });
  } else {
    res.status(404).send("File not found");
  }
});

app.post(`/${ROUTE}`, (req, res) => {
  fs.appendFile(filePath, req.body.commands + "\n", "utf8", (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to save file");
    }
    res.status(200).send("File saved successfully!");
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
