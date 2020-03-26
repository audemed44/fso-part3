const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/people");

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
morgan.token("body", function(req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// let persons = [
//   {
//     name: "aakash2",
//     number: "1245",
//     id: 1
//   },
//   {
//     name: "aa",
//     number: "123",
//     id: 2
//   },
//   {
//     id: 3,
//     name: "add",
//     number: "47"
//   }
// ];

app.get("/info", (req, res) => {
  Person.countDocuments({}).exec((err, count) => {
    if (err) {
      res.send(err);
      return;
    }
    res.send(`Phonebook has info for ${count} people<div>${new Date()}</div>`);
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({})
    .then(people => {
      res.json(people.map(person => person.toJSON()));
    })
    .catch(error => next(error));
});
app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      console.log(person);
      if (!person) {
        res.status(404).end();
      } else res.json(person.toJSON());
    })
    .catch(error => {
      next(error);
    });
});
app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

app.post("/api/persons", (req, res, next) => {
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
  // if (persons.find(person => person.name === body.name))
  //   return res.status(400).json({ error: "name must be unique" });
  const person = new Person({
    name: body.name,
    number: body.number
  });
  person
    .save()
    .then(savedPerson => {
      res.json(savedPerson.toJSON());
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON());
    })
    .catch(error => next(error));
});
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "ValidationError")
    return response.status(400).json({ error: error.message });
  next(error);
};

// handler of requests with result to errors
app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
