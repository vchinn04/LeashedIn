// getting-started.js
const mongoose = require('mongoose');

const mongoPass = require('./mongo-pass.js');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  aboutMe: String,
  ownerName: String,
  pets: Array,
  profilePicture: String,
  username: String
});

const petSchema = new mongoose.Schema({
  PetId: String,
  PetName: String,
  PetType: String,
  PetDescription: String,
  PetImage: String
})

const PetM = mongoose.model("Pets", petSchema)
const UserM = mongoose.model('Users', userSchema);

exports.setupMongo = async function () { //Connect to our database and output that connection was successful
  const uri = mongoPass.AtlasPass//url for connecting with our MongoDB Atlas
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

exports.addUser = async function (usrEmailV, usrNameV, usrPasswordV) {
  console.log("Adding user");

  const userEntry = new UserM({email: usrEmailV, name: usrNameV, password: usrPasswordV}); //Create a model (documet) for user

  await userEntry.save(); //Save to our database

  const userss = await UserM.find(); //Trying to retrieve all the Users collection  documents.
  console.log(userss);
  console.log(userEntry);
}

exports.getUser =  async function (usrIndex) { //Getter function template
  console.log("Getting user");
  console.log(usrIndex)

  let docs = await UserM.find({ email:usrIndex });
  console.log("--------DOCS-----------")
  console.log(docs)
  console.log("------------------")
  return  docs;
}

exports.getUserData =  async function (usrIndex) { //Getter function template
  console.log("Getting user data");
  console.log(usrIndex)

  let docs = await UserM.findOne({ username:usrIndex });
  return  docs;
}

exports.getUserList =  async function (searchParams) { //Getter function template
  console.log("Getting user list");
  console.log(searchParams)
  const regExVar = "/"+searchParams+"/"
  let docs = await UserM.find({ username:{ $regex: new RegExp('^' + searchParams , 'i') } }).limit(5);
  console.log("--------DOCS-----------")
  console.log(docs)
  console.log("------------------")
  return  docs;
}

exports.updateUser = function (userInfo) { //Function will be used for updating existing users data
  console.log("Updating user");
   UserM.findOneAndUpdate({username: userInfo.username},{ownerName: userInfo.ownername, aboutMe: userInfo.aboutme, profilePicture: userInfo.profilepic},function(error,result){
     if(error){
       console.log("Error: ", error)
     }else{
       console.log(result);
     }
   });
}


/*-----------PET FUNCTIONS----------*/
exports.createPet = async function(petEntry, usrIndx)  {
  petId = ""
  let isExist = false
  do
  {
      petId = await crypto.randomBytes(20)
      petId = petId.toString('hex')

      isExist = await PetM.exists({ PetId: petId });

      if (!isExist)
      {
        petEntry["PetId"] = petId
        const petDatEntry = new PetM(petEntry)

        await petDatEntry.save()
        let docs = await UserM.findOne({ username:usrIndx });
        newPetList = docs.pets
        newPetList.push(petId)
        UserM.findOneAndUpdate({username:usrIndx},{pets: newPetList},(error,result) => {
          if(error){
            console.log("Error: ", error)
          }else{
            console.log(result);
          }
        });

        break
      }
  } while (isExist)

  return petId
}

exports.getPet = async function (petId) {
  let docs = await PetM.findOne({ PetId:petId });
  return  docs;
}

exports.getUserPets = async function (usrIndex) {
  let docs = await UserM.findOne({ username:usrIndex });
  petArr = []

  for (let i of docs.pets)
  {
    let petEntry = await PetM.findOne({ PetId:i });
    petArr.push(petEntry)
  }

  return  petArr;
}

exports.updatePet = function(petInfo) {

}

exports.deletePet = async function(petId, userIndex) {
  let ret = await PetM.findOneAndRemove({PetId:petId});
  let docs = await UserM.findOne({ username:userIndex });

  let index = -1
  for (let i = 0; i < docs.pets.length; i++) {
    if (petId == docs.pets[i]){
      index = i
      break
    }
  }
  if (index > -1)
    docs.pets.splice(index, 1);

  UserM.findOneAndUpdate({username:userIndex},{pets: docs.pets},(error,result)=>{console.log("Successfully Updated User Pet Deletion!")})

  return ret;
}
/*--------------------------------*/
