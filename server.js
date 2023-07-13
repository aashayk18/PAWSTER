const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/petDatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connection established successfully.');
  }).catch((err) => {
    console.error('Error establishing MongoDB connection:', err);
  });

const db = mongoose.connection;

const petSchema = new mongoose.Schema({
  name: String,
  age: Number, // Change 'age' data type to Number
  traits: String,
  toy: String,
  image: String
});

const Pet = mongoose.model('Pet', petSchema); // Change model name to 'Pet'

app.post('/add-pet', upload.single('petImage'), (req, res) => {
  const petData = {
    name: req.body.petName,
    age: req.body.petAge,
    traits: req.body.petTraits,
    toy: req.body.petToy,
    image: req.file.filename
  };

  const pet = new Pet(petData);

  pet.save()
    .then(() => {
      res.status(200).send('Pet data stored successfully');
    })
    .catch((err) => {
      console.error('Error storing pet data:', err);
      res.status(500).send('Error storing pet data');
    });
});

// Route to get all pets
app.get('/get-pets', (req, res) => {
  Pet.find({}, (err, pets) => {
    if (err) {
      console.log('Error fetching pets:', err);
      res.status(500).json({ error: 'Error fetching pets' });
    } else {
      res.json({ pets: pets });
    }
  });
});

app.get('/search', async (req, res) => {
  const searchTerm = req.query.term;
  const regex = new RegExp(searchTerm, 'i');
  const pets = await Pet.find({ name: regex });
  if (!pets) {
    res.status(404).send('No pets found');
    return;
  }
  res.json(pets);
});

// Route to get a pet by ID
app.get('/get-pet', (req, res) => {
  const id = req.query.id;
  Pet.findById(id, (err, pet) => {
    if (err) {
      console.log('Error fetching pet:', err);
      res.status(500).json({ error: 'Error fetching pet' });
    } else if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
    } else {
      res.json(pet);
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
