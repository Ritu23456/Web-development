const express = require('express');
const router = express.Router();
const User = require('./../models/user');

const {jwtAuthMiddleware, generateToken} = require('./../jwt');

// Post route to add a new user
router.post('/signup', async(req, res) => {
  try {
    const userData = req.body 
    const newUser = new User(userData);
    const response = await newUser.save();
    console.log('User data Saved');

    const payload = {
      id: response.id
    }

    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log('Token is : ', token);

    res.status(200).json({response: response, token: token});
  } 
  catch (error) {
    console.log(error);
    res.status(500).json({erron: 'Internal Server Error'});
  }
})

// Login the user
router.post('/login', async (req, res) => {
  try {
    // Extract aadharCardNumber and password from request body
    const {aadharCardNumber, password} = req.body;

    // find the aadharCardNumber exist or not
    const user = await User.findOne({aadharCardNumber: aadharCardNumber});

    // If user does not exist or password does not match, return error
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error: 'Invalid aadharCardNumber or password'});
    }
    // generate token 
    const payload = {
      id: user.id
    }
    const token = generateToken(payload);
    res.json({token});

  } catch (error) {
    console.log(error)
    res.status(500).json({error: 'Internal Server Error'});
  }
}) 
// router to get user's profile
router.get('/profile', jwtAuthMiddleware, async(req, res) => {
  try {
    const userData = req.user; // Extrack the id from the token
    const userId = userData.id;
    const user = await User.findById(userId);
    res.status(200).json({user});
  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
})
// router to change user password
router.put('/profile/password',jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user; // extract the id from the token
    const {currentPassword, newPassword} = req.body // Extract the current and new password from request body

    const user = await User.findById(userId);
    
    // if password donesn't matched
    if(!(await user.comparePassword(currentPassword))){
      return res.status(401).json({error: 'Invalid username or password'})
    }

    // Update the user's paassword
    user.password = newPassword;
    await user.save();

    console.log("password updated");
    res.status(200).json({message: "password updated"});

  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
})







module.exports = router
