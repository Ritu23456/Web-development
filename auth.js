// sets up Passport with a local authentication strategy, using a Person model for username and password

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;  // Adjust the path as needed
const Person = require('./models/person');

// verification logic
passport.use(new LocalStrategy(async (username, password, done) => {
  // authentication Logic here
  try {
    // console.log('Reveived credentials: ', username, password);
    const user = await Person.findOne({username: username});

    if(!user){ // if the user does not exist into the database
      return done(null, false, {message: 'Incorrect username.'});
    }

    const isPasswordMatch = await user.comparePassword(password);
    if(isPasswordMatch) { // User matched with correct password
      return done(null, user);
    }else { // Password does not matched
      return done(null, false, {message: 'Incorrect password.'})
    }

  } catch (error) {  // Any other type of error
      return done(err);
  }
}))

module.exports = passport;  // export configured passport