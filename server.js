const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'yxXvLYtKcxp8I5)sfK5VvXryR2heI#yWd*6Z*a5Bt%mVvLcW9b';

mongoose.connect(
  'mongodb+srv://dblatt:dblattmoduldokumentation@moduldokumentation.gseuyif.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

const app = express();
app.use('/', express.static(path.join(__dirname, 'dist')));
app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.post('/api/register', async (req, res) => {
  const { username, password: plainTextPassword, isTeacher } = req.body;

  if (!username || typeof username !== 'string') {
    return res.json({ status: 'error', error: 'Invalid username' });
  }

  if (!plainTextPassword || typeof plainTextPassword !== 'string') {
    return res.json({ status: 'error', error: 'Invalid password' });
  }

  if (plainTextPassword.length < 5) {
    return res.json({
      status: 'error',
      error: 'Password too small. Should be atleast 6 characters',
    });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = await User.create({
      username,
      password,
      isTeacher,
    });
    console.log('User created successfully: ', response);
    res.render('menu');
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return res.json({ status: 'error', error: 'Username already in use' });
    }
    throw error;
  }

  res.json({ status: 'ok' });
});

app.get('/menu', function (req, res) {
  res.send('menu');
});

app.listen(3333, () => {
  console.log('Server up at 3333');
});
