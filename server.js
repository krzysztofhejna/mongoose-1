const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb+srv://Marvelm:Fortepian123!@cluster0-ekl59.mongodb.net/test?retryWrites=true', {
    useMongoClient: true
});

const userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean
});

userSchema.methods.manify = function(next) {
  this.name = this.name + '-boy';

  return next(null, this.name);
};

userSchema.pre('save', function(next) {
  const currentDate = new Date();

  this.updated_at = currentDate;

  if (!this.created_at) {
      this.created_at = currentDate;
  }
  
  next();
});

const User = mongoose.model('User', userSchema);

const kenny = new User({
  name: 'Kenny',
  username: 'Kenny_the_boy',
  password: 'password'
});

kenny.manify(function(err, name) {
  if (err) throw err;
  console.log('Your new name is: ' + name);
});

kenny.save(function(err) {
  if (err) throw err;

  console.log('User saved successfully');
});

const benny = new User({
  name: 'Benny',
  username: 'Benny_the_boy',
  password: 'password'
});

benny.manify(function(err, name) {
  if (err) throw err;
  console.log('Your new name is: ' + name);
});

benny.save(function(err) {
  if (err) throw err;

  console.log('User ' + benny.name +  ' saved successfully');
});

const mark = new User({
  name: 'Mark',
  username: 'Mark_the_boy',
  password: 'password'
});

mark.manify(function(err, name) {
  if (err) throw err;
  console.log('Your new name is: ' + name);
});

mark.save(function(err) {
  if (err) throw err;

  console.log('User ' + mark.name +  ' saved successfully');
});


User.find({}, function(err, res) {
  if (err) throw err;
  console.log('Actual database records are ' + res);
});

const findAllUsers = function() {
  return User.find({}, function(err, res) {
      if (err) throw err;
      console.log('Actual database records are ' + res);
  });
}

const findSpecificRecord = function() {
  return User.find({ username: 'Kenny_the_boy' }, function(err, res) {
      if (err) throw err;
      console.log('Record you are looking for is ' + res);
  })
}

const updadeUserPassword = function() {
  return User.findOne({ username: 'Kenny_the_boy' })
      .then(function(user) {
          console.log('Old password is ' + user.password);
          console.log('Name ' + user.name);
          user.password = 'newPassword';
          console.log('New password is ' + user.password);
          return user.save(function(err) {
              if (err) throw err;

              console.log('User ' + user.name + ' has been updated');
          })
      })
}

const updateUsername = function() {
  return User.findOneAndUpdate({ username: 'Benny_the_boy' }, { username: 'Benny_the_man' }, { new: true }, function(err, user) {
      if (err) throw err;

      console.log('Nazwa Usera po aktualizacji to ' + user.username);
  })
}

const findMarkAndDelete = function() {
  return User.findOne({ username: 'Mark_the_boy' })
      .then(function(user) {
          return user.remove(function() {
              console.log('User successfully deleted');
          });
      })
}

const findKennyAndDelete = function() {
  return User.findOne({ username: 'Kenny_the_boy' })
      .then(function(user) {
          return user.remove(function() {
              console.log('User successfully deleted');
          });
      });
}

const findBennyAndRemove = function() {
  return User.findOneAndRemove({ username: 'Benny_the_man' })
      .then(function(user) {
          return user.remove(function() {
              console.log('User successfully deleted');
          });
      });
}

Promise.all([kenny.save(), mark.save(), benny.save()])
  .then(findAllUsers)
  .then(findSpecificRecord)
  .then(updadeUserPassword)
  .then(updateUsername)
  .then(findMarkAndDelete)
  .then(findKennyAndDelete)
  .then(findBennyAndRemove)
  .catch(console.log.bind(console))
