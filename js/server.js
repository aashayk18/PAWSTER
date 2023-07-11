const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Destination folder for storing uploaded images

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/petDatabase', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

const petSchema = new mongoose.Schema({
  name: String,
  age: String,
  traits: String,
  toy: String,
  image: String
});

const Pet = mongoose.model('Pet', petSchema);

// Set up routes
app.post('/store-data-to-mongodb', upload.single('petImage'), (req, res) => {
  
  const pet = new Pet({
    name: req.body.petName,
    age: req.body.petAge,
    traits: req.body.petTraits,
    toy: req.body.petToy,
    image: req.file.filename
  });

  
  pet.save((err) => {
    if (err) {
      console.error('Error storing pet data:', err);
      res.status(500).send('Error storing pet data');
    } else {
      res.status(200).send('Pet data stored successfully');
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
