const { Router } = require('express');
const router = Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(400).json({ message: 'Unauthorized request' });
  }

  const token = req.headers.authorization.split(' ')[1];

  if (token === null) {
    return res.status(401).json({ message: 'Unauthorized request' });
  }
  const payload = jwt.verify(token, 'secretKey');
  req.userId = payload._id;
  req.userEmail = payload.email;
  next();
};

router.get('/', verifyToken, (req, res) => {
  res.send(
    `Tu email es ${req.userEmail} y tu token es ${
      req.headers.authorization.split('Bearer ')[1]
    }`
  );
});

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();
  const token = jwt.sign(
    { _id: newUser._id, email: newUser.email },
    'secretKey'
  );
  res.status(200).json({ token });
});

router.post('/login', async (req, res) => {
  const { email, password: hashedPassword } = req.body;
  console.log(email);
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Email doesn't exist" });
  }
  const valid = await bcrypt.compare(hashedPassword, user.password);
  if (!valid) {
    return res.status(401).json({ message: 'Wrong password' });
  }

  const token = jwt.sign({ _id: user._id, email: user.email }, 'secretKey');
  return res.status(200).json({ token });
});

module.exports = router;
