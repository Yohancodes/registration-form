const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/config')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Define Mongoose schema
const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  secondname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true},
  idno: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Serve form HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/register', async (req, res) => {
  try {
    const { firstname, secondname, email, phone, idno } = req.body;

     // Phone validation
     const isValidPhone =
     (phone.startsWith('07') || phone.startsWith('+254')) &&
     /^\+?254\d{9}$|^07\d{8}$/.test(phone);

      // ID validation
    const isValidID = /^\d{8}$/.test(idno);

   if (!isValidPhone) {
     throw new Error("Phone number must start with '07' or '+254' and be 10 digits.");
   }
   
   if (!isValidID) {
    throw new Error("ID number must be exactly 8 digits.");
  }
   
    const newUser = new User({ firstname, secondname, email, phone, idno });
    await newUser.save();
    console.log(`✅ Registered: ${firstname} ${secondname}`);
    res.redirect('/?success=1');

  } catch (error) {
    console.error('❌ Error saving user:', error.message);
    res.redirect('/?error=' + encodeURIComponent(error.message));
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

