// getting-started.js
const mongoose = require('mongoose');

const mongoPass = require('./mongo-pass.js');

const userSchema = new mongoose.Schema({
  usrId: Number,
  name: String,
  hobby: Map
});
const UserM = mongoose.model('Users', userSchema);

exports.setupMongo = async function () { //Connect to our database and output that connection was successful
  const uri = "mongodb+srv://LeashedIn:" + mongoPass.AtlasPass + "@cluster0.pyvzkqi.mongodb.net/?retryWrites=true&w=majority" //url for connecting with our MongoDB Atlas
  console.log('\x1b[33m', "Attempting Connection with MongoDB")

  await mongoose.connect(uri); //Try to connect to MongoDB

  if (mongoose.Connection) {
    console.log("\x1b[32m", "MongoDb Connection Stable!");
  }
  else {
    console.log('\x1b[31m', "Connection with MongoDB Failed!")
    process.exit(1);
  }
}

exports.addUser = async function (usrIdV, usrNameV, usrHobbyV) {
  console.log("Adding user");

  const userEntry = new UserM({ usrId: usrIdV, name: usrNameV, hobby: usrHobbyV }); //Create a model (documet) for user

  await userEntry.save(); //Save to our database

  const userss = await UserM.find(); //Trying to retrieve all the Users collection  documents.
  console.log(userss);
  console.log(userEntry);
}

exports.getUser = function (usrIndex) { //Getter function template
  console.log("Getting user");

}

exports.updateUser = function (userIndex) { //Function will be used for updating existing users data
  console.log("Updating user");

}
