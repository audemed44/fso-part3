const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://audemed:${password}@fullstackopen-kcbbo.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length == 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  });

  person.save().then(response => {
    console.log(`added ${person.name} number ${person.number} to database`);
    mongoose.connection.close();
  });
} else if (process.argv.length == 3) {
  Person.find({}).then(result => {
    console.log("phonebook:");
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  console.log("Please enter correct command line arguments.");
}
