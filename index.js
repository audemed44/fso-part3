const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
morgan.token("body", function(req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    name: "aakash2",
    number: "1245",
    id: 1
  },
  {
    name: "aa",
    number: "123",
    id: 2
  },
  {
    id: 3,
    name: "add",
    number: "47"
  }
];

app.get("/info", (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people
<div>${new Date()}</div>`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  if (person) res.json(person);
  else res.status(404).end();
});
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: "name missing"
    });
  }
  if (!body.number) {
    return res.status(400).json({
      error: "number missing"
    });
  }
  if (persons.find(person => person.name === body.name))
    return res.status(400).json({ error: "name must be unique" });
  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  };

  persons = persons.concat(person);

  res.json(person);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
