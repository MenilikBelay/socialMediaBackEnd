const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();


router.post('/', async (req, res) => {
  console.log(req.body)
  //validate at the client first
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

    //check the email
  let user = await User.findOne({ userName: req.body.userName });
  if (!user) return res.status(400).send('Invalid user name or password.');

  //check the password
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) return res.status(400).send('Invalid user name or password.');

  //USER ID : json web token in the user model, add isAdmin flag, email, userName as well
  const token = user.generateAuthToken(); 
  res.status(200).json({
    token:token,
    expiresIn: 3600,
    userId:user._id
  }); 
});

function validate(req) {
  const schema = {

    userName: Joi.string().required(),
    password: Joi.string().min(4).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
