const express = require('express');
const bodyParser = require('body-parser'); // Middleware to parse incoming requests before handlers

const app = express();
const port = process.env.PORT || 5000; //Set our port to be 5000 (localhost:5000)

const dataManager = require('./modules/data-manager.js')

app.use(bodyParser.json()); //Parses JSON and turns into JS accessible vars
app.use(bodyParser.urlencoded({ extended: true })); //Does same as line above but for URL encoded. extended=true means the data may not neccessarily be just a string.
const multer  = require('multer')
const fs = require('fs')

const pfpStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "---" + file.originalname)
  }
})

const petStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./petpics");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "---" + file.originalname)
  }
})

const postStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./postpics");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "---" + file.originalname)
  }
})
const upload = multer({ storage: pfpStorageEngine })
const pet_upload = multer({ storage: petStorageEngine })
const post_upload = multer({ storage: postStorageEngine })

testDict = { //IGNORE just used to make sure client-server communication worked!
  "vchinn04" : {
    "money": 0,
    "status": "ye..."
  }
};

app.get('/api/hello', (req, res) => { //Get Event
  res.send({ express: 'Hello from Express' });
});

app.get('/api/ExperienceGetter', (req, res) => { //Get Event
  res.send({ express: 'heye from Express' });
});

app.get('/getUserArr', async (req, res) => { //Get Event
  console.log(req.query)
  const userListData = await dataManager.getUserList(req.query.searchEntry)

  res.send({ express: 'heye from Express', userList: JSON.stringify(userListData)  });
});

app.get('/getUserProfileText', async (req, res) => { //Get Event
  console.log(req.query)
  const userData = await dataManager.getUserData(req.query.username)
  res.send({ aboutMe: userData.aboutMe, ownerName: userData.ownerName})
});

app.get('/getUserProfilePic', async (req, res) => { //Get Event
  console.log("Getting Profile Pic!")
  const userData = await dataManager.getUserData(req.query.username)
  if (userData.profilePicture){
    let imagePath = "/images/" + userData.profilePicture
    res.sendFile(imagePath, { root: __dirname });
  }
  else {
    res.send({result: false})
  }
});

app.post('/UserLogIn', async (req, res) => { //Get Event
  var inputDict = req.body;
  console.log("Log In request!")
  console.log(req.body)
  console.log(req.body.email)

  const userData = await dataManager.getUser(req.body.email)

  console.log(userData)
  userObj = userData[0];
  console.log(userObj)
  if (userObj == undefined){
    console.log("Bad email!")

    res.send({ loginStatus: false, errorMessage: 'Invalid email or password!' });
  }
  else if (userObj.password != req.body.password) {
    console.log("Bad passowrd!")
    res.send({ loginStatus: false, errorMessage: 'Invalid email or password!' });
  }
  else {
    console.log("Success!")
    console.log(userData.username)
    res.send(JSON.stringify({ loginStatus: true, username: userObj.username, errorMessage: 'No Errors!' }));
  }
});

app.post('/UserCreateAccount', async (req, res) => { //Get Event
  var inputDict = req.body;
  console.log("Create account request!")
  console.log(req.body)
  console.log(req.body.email)
  dataManager.addUser(req.body.email, req.body.username, req.body.password)
});

app.post('/MoreInfoCreateUpdateProfile', async (req, res) => {
  console.log(req.body.entityType)
  console.log(req.body.aboutMe)
  console.log(req.body.ownerName)
  console.log(req.body.username)

  const userInfo = {
    entityType: req.body.entityType,
    aboutMe: req.body.aboutMe,
    ownerName: req.body.ownerName,
    username: req.body.username
  }

  dataManager.moreInfoCreateUpdateUser(userInfo);
  res.send(JSON.stringify({ loginStatus: "ohh yea", errorMessage: 'No Errors!' }));

});

app.post('/PostTestEvent', (req, res) => {//Post Event, used to set data on server
  console.log(req.body);

  var inputDict = req.body;
  console.log(inputDict);

  var inputKey = inputDict.dataKey;
  console.log(inputKey);

  var inputValue = inputDict.dataValue;
  console.log(inputValue);

  dataManager.addUser(21, inputKey, inputValue);
  testDict[inputKey] = inputValue;
  res.send(
    JSON.stringify(testDict),
  );
});


app.post('/UpdateProfile', upload.single('image'), async (req, res) => {
  console.log(req.file)
  console.log(req.body.username)
  console.log(req.body.aboutme)
  console.log(req.body.ownername)

  const userInfo = {
    username: req.body.username,
    ownername: req.body.ownername,
    aboutme: req.body.aboutme,
    profilepic: req.file.filename
  }

  const userData = await dataManager.getUserData(req.body.username)
  if (userData.profilePicture != "")
  {
    const imagePath = __dirname + "/images/" + userData.profilePicture
    fs.unlinkSync(imagePath)
  }

  dataManager.updateUser(userInfo);
  res.send(JSON.stringify({ loginStatus: "ohh yea", errorMessage: 'No Errors!' }));

});


/*-----------PET FUNCTIONS----------*/

app.post('/CreatePet', pet_upload.single('petimage'), async (req, res) => {
  console.log("Creating Pet!")
  console.log(req.file)
  console.log(req.body.PetType)
  console.log(req.body.PetName)
  console.log(req.body.PetDescription)
  console.log(req.body.userIndex)

  const petEntry = {
    PetType: req.body.PetType,
    PetName: req.body.PetName,
    PetDescription: req.body.PetDescription,
    PetImage: ((req.file) ? req.file.filename : "")
  }

  const petId = await dataManager.createPet(petEntry, req.body.userIndex);
  let fileP = ""

  if (req.file)
    fileP = req.file.filename

 returnPet = {
    PetId: petId,
    PetType: req.body.PetType,
    PetName: req.body.PetName,
    PetDescription: req.body.PetDescription,
    PetImage: fileP
  }

  res.send(JSON.stringify(returnPet));
});

app.put('/CreatePet', pet_upload.single('petimage'), async (req, res) => {
  console.log("Updating Pet!")
  console.log(req.file)
  console.log(req.body.PetType)
  console.log(req.body.PetName)
  console.log(req.body.PetDescription)
  console.log(req.body.petId)

  let oldPetEntry = await dataManager.getPet(req.body.petId)

  if (!oldPetEntry)
    res.send({ returnValue: false })

  if (oldPetEntry.PetImage != "" && req.file)
  {
    const imagePath = __dirname + "/petpics/" + oldPetEntry.PetImage
    fs.unlinkSync(imagePath)
  }

  const petEntry = {
    PetId: req.body.petId,
    PetType: req.body.PetType,
    PetName: req.body.PetName,
    PetDescription: req.body.PetDescription,
    PetImage: ((req.file) ? req.file.filename : oldPetEntry.PetImage)
  }

  const success = await dataManager.updatePet(petEntry, req.body.petId);
  let fileP = oldPetEntry.PetImage

  if (req.file)
    fileP = req.file.filename

 returnPet = {
    PetId: req.body.petId,
    PetName: req.body.PetName,
    PetImage: fileP
  }

  res.send(JSON.stringify(returnPet));
});


app.get('/getUserPets', async (req, res) => { //Get Event
  console.log(req.query)
  const petList = await dataManager.getUserPets(req.query.username)
  res.send(petList)
});

app.get('/getPetPic', async (req, res) => { //Get Event
  console.log(req.query)
  let imagePath = "/petpics/" + req.query.imagePath
  res.sendfile(imagePath, { root: __dirname });
});

app.delete('/DeletePet', async (req, res) => { //Get Event
  console.log(req.query)
  let petEntry = await dataManager.getPet(req.query.petId)

  if (!petEntry)
    res.send({ returnValue: false })

  if (petEntry.PetImage != "")
  {
    const imagePath = __dirname + "/petpics/" + petEntry.PetImage
    fs.unlinkSync(imagePath)
  }

  let ret = await dataManager.deletePet(req.query.petId, req.query.userIndex)
  res.send({ returnValue: ret })
});
/*--------------------------------*/

// Post functions

app.post('/UserCreatePost', post_upload.single('postimage'), async (req, res) => { //Get Event
  console.log("Creating Post!")

  const postEntry = {
    postDescription: req.body.PostDescription,
    postLikes: 0,
    postImage: ((req.file) ? req.file.filename : "")
  }
  console.log(req.body)
  console.log(req.body.PostDescription)
  const postId = await dataManager.addPost(postEntry, req.body.userIndex);
  let fileP = ""

  if (req.file)
    fileP = req.file.filename

 returnPost = {
    postId: postId,
    postDescription: req.body.PostDescription,
    postLikes: 0,
    postImage: fileP
  }
  console.log(returnPost)
  res.send(JSON.stringify(returnPost));
});


app.get('/getUserPosts', async (req, res) => { //Get Event
  const postList = await dataManager.getUserPosts(req.query.username)
  res.send(postList)
});

app.get('/getEveryUserPosts', async (req, res) => { //Get Event
  const postList = await dataManager.getEveryUserPosts()
  res.send(postList)
});

app.get('/getPostPic', async (req, res) => { //Get Event
  let imagePath = "/petpics/" + req.query.imagePath
  res.sendfile(imagePath, { root: __dirname });
});

app.get('/getPostLikes', async (req, res) => { //Get Event
  let likes = await dataManager.getPostLikes(req.query.postId)
  return likes
});

app.post('/UpdatePostLikes', upload.single('image'), async (req, res) => {

  const postInfo = {
    postId: req.body.postId,
    postLikes: req.body.postLikes
  }


  dataManager.updateLikes(postInfo);
  console.log(postInfo.postLikes)
  res.send(JSON.stringify({ loginStatus: "ohh yea", errorMessage: 'No Errors!' }));

});

app.post('/DecreaseLikes', upload.single('image'), async (req, res) => {

  const postInfo = {
    postId: req.body.postId,
    postLikes: req.body.postLikes
  }


  dataManager.decreaseLikes(postInfo);
  console.log("LIKEs")
  console.log(postInfo.postLikes)
  res.send(JSON.stringify({ loginStatus: "ohh yea", errorMessage: 'No Errors!' }));

});

app.delete('/DeletePost', async (req, res) => { //Get Event
  let postEntry = await dataManager.getPost(req.query.postId)

  if (!postEntry)
    res.send({ returnValue: false })

  
  let ret = await dataManager.deletePost(req.query.postId, req.query.userIndex)
  res.send({ returnValue: ret })
});

dataManager.setupMongo().catch(err => console.log(err)); //Initialize the DataBase in the data-manager modules
app.listen(port, () => console.log(`Server Up! Listening on port ${port}`)); //Binds server to localhost:5000
