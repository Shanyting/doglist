// Github Link: https://github.com/Shanyting/doglist

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const hbs = require("hbs");
const path = require("path");
const _ = require("lodash");
const methodOverride = require("method-override"); // for overriding forms
const {Dog} = require("./models/dog.js");

// to start the app:
const app = express();

// hbs Setup
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../app/views"));
hbs.registerPartials(path.join(__dirname, "../app/views/partials"));

const port = process.env.PORT || 3000;
mongoose.Promise = global.Promise;
const database = process.env.MONGODB_URI || 'mongodb://localhost:27017/Doglist';
// database can either be set for us by MongoDB or be a local one
// have to use the mongodb protocal ('mongodb://localhost:27017')

mongoose.connect(database) // this returns a promise
.then(() => {
  console.log("connected to database");
})
.catch(() => {
  console.log("unable to to connect to database");
})

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.redirect("/dogs");
})

app.get("/dogs", (req, res) => {
  Dog.find()
     .then(dogs => {
       res.render("./dogs/index.hbs", {dogs});
     })
     .catch(e => {
       res.status(404).send(e);
     })
})

app.get("/dogs/new", (req, res) => {
  res.render("./dogs/new.hbs");
})

app.post("/dogs", (req, res) => {
  if(!req.body.name || !req.body.age) {
    res.status(400).send("Error -- Did not include name and age");
  }
  const dog = new Dog({
    name: req.body.name,
    age: req.body.age,
    description: req.body.description,
    image: req.body.image
  })
  dog.save()
  .then(dog => {
    res.redirect("/dogs");
  })
  .catch(e => {
    res.status(404).send(e);
  })
})

app.get("/dogs/:id", (req, res) => {
  const id = req.params.id;
  Dog.findById(id)
     .then(dog => {
       res.render("./dogs/show.hbs", { dog });
     })
     .catch(e => {
       res.status(404).send(e);
     })
})

app.get("/dogs/:id/edit", (req, res) => {
  const id = req.params.id;
  Dog.findById(id)
     .then(dog => {
       res.render("./dogs/edit.hbs", {
         dog: dog
       });
     })
     .catch(e => {
       res.status(404).send(e);
     })
})

app.patch("/dogs/:id/edit", (req, res) => {
  const id = req.params.id;
  Dog.findByIdAndUpdate(id, req.body, {new: true})
     .then(dog => {
       res.redirect("/dogs");
     })
     .catch(e => {
       res.status(404).send(e);
     })
})

app.delete("/dogs/:id", (req, res) => {
  const id = req.params.id;
  Dog.findByIdAndRemove(id)
     .then(dog => {
       res.redirect("/dogs");
     })
     .catch(e => {
       res.status(404).send(e);
     })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})






// dogs/index.hbs
  // main page Doglist
  // create button on top
  // grid layout of "dog cards"
  // each "dog card" has a pictire (url of picture), name, age, description

// dogs/show/:id
  // home button on top
  // picture of dog
  // name picture description
  // delete button
  // update button

  // <a href = ({/dogs/idnumber})>
