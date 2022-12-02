const express = require('express');
const bodyParser = require('body-parser'); // Middleware to parse incoming requests before handlers

const app = express();
const port = process.env.PORT || 5000; //Set our port to be 5000 (localhost:5000)

const dataManager = require('./modules/data-manager.js')

app.use(bodyParser.json()); //Parses JSON and turns into JS accessible vars
app.use(bodyParser.urlencoded({ extended: true })); //Does same as line above but for URL encoded. extended=true means the data may not neccessarily be just a string.
const multer  = require('multer')
const fs = require('fs')

const pfpStorageEngine = multer.diskStorage({ // this sets up where multer will store user profile images and how they are named
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "---" + file.originalname)
  }
})

const petStorageEngine = multer.diskStorage({ // this sets up where multer will store user pet profile images and how they are named
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

app.get('/getUserArr', async (req, res) => { // returns an array of searched for users
  console.log(req.query)
  const userListData = await dataManager.getUserList(req.query.searchEntry)

  res.send({ express: 'heye from Express', userList: JSON.stringify(userListData)  });
});

app.get('/getUserLiked', async (req, res) => { // returns an array of searched for users
  console.log(req.query)
  const userLiked = await dataManager.getUserLiked(req.query.username)

  res.send({ liked: userLiked });
});

app.get('/getUserProfileText', async (req, res) => { // return the profile info of specified user
  console.log(req.query)
  const userData = await dataManager.getUserData(req.query.username)
  res.send({ aboutMe: userData.aboutMe, ownerName: userData.ownerName, followers: userData.followers})
});

app.get('/getUserProfilePic', async (req, res) => { // return the profile picture of a specified user
  const userData = await dataManager.getUserData(req.query.username)
  if (userData && userData.profilePicture){
    let imagePath = "/images/" + userData.profilePicture
    let checkPath = __dirname + imagePath
    fs.exists(checkPath,  (exists) => {
      if (exists)
        res.sendFile(imagePath, { root: __dirname });
      else {
        res.send({result: false})
      }
    });
  }
  else {
    res.send({result: false})
  }
});

app.get('/UserLogIn', async (req, res) => { // login authentication
  var inputDict = req.body;
  console.log("Log In request!")
  console.log(req.query)
  console.log(req.query.username)

  const userData = await dataManager.getUser(req.query.username)

  console.log(userData)
  userObj = userData[0];
  console.log(userObj)

  if (userObj == undefined){
    console.log("Bad username!")
    res.send({ loginStatus: false, errorMessage: 'Invalid username or password!' });
  }
  else if (userObj.password != req.query.password) {
    console.log("Bad password!")
    res.send({ loginStatus: false, errorMessage: 'Invalid username or password!' });
  }
  else {
    console.log("Success!")
    console.log(userData.username)
    res.send(JSON.stringify({ loginStatus: true, username: userObj.username, errorMessage: 'No Errors!' }));
  }
});

app.post('/CheckUserExistence', async (req, res) => {
  const checkResult = await dataManager.checkIfUserExists(req.body.username)
  if (checkResult == true) {
    res.send(JSON.stringify({ doesExist: true }))
  } else {
    res.send(JSON.stringify({ doesExist: false }))
  }
});

app.put('/UpdateProfile', upload.single('image'), async (req, res) => { // responsible for updating a user's profile
  //console.log("UPDATING USER!")
//  console.log(req.file)
  //console.log(req.body.username)
//  console.log(req.body.aboutme)
//  console.log(req.body.ownername)
//  console.log("------------------------")

  const userInfo = {
    username: req.body.username,
    ownername: req.body.ownername,
    aboutme: req.body.aboutme,
    profilepic: (req.file) ? req.file.filename : null
  }

  const userData = await dataManager.getUserData(req.body.username)
  if (userData.profilePicture)
  {
    const imagePath = __dirname + "/images/" + userData.profilePicture
    if (userData.profilePicture.length > 3)
      fs.exists(imagePath,  (exists) => {
        if (exists)
          fs.unlinkSync(imagePath)
      });
  }

  dataManager.updateUser(userInfo);
  res.send(JSON.stringify({ loginStatus: "ohh yea", errorMessage: 'No Errors!' }));
});

app.post('/UpdateFollowers', async (req, res) => { // responsible for toggling followers
  var userData = await dataManager.getUserData(req.body.username)
  var userDataOther = await dataManager.getUserData(req.body.usernameOther)

  if (!("following" in userData))
    userData["following"] = []

  if (!("followers" in userDataOther))
    userDataOther["followers"] = []

  var userArr = userData.following
  var userArrOther = userDataOther.followers
  var returnData = null

  if (userArrOther.includes(req.body.username))
  {
    let index = -1
    for (let i = 0; i < userArrOther.length; i++) {
      if (req.body.username == userArrOther[i]){
        index = i
        break
      }
    }
    if (index > -1)
      userArrOther.splice(index, 1);

    let index2 = -1
    for (let i = 0; i < userArr.length; i++) {
      if (req.body.usernameOther == userArr[i]){
        index2 = i
        break
      }
    }
    if (index > -1)
      userArr.splice(index2, 1);

    var updateData = {
      followers: userArrOther,
      following: userArr
    }
    console.log(updateData)
    returnData = await dataManager.updateFollowers(req.body.username, req.body.usernameOther, updateData)
  }
  else
  {
    userArr.push(req.body.usernameOther)
    userArrOther.push(req.body.username)

    var updateData = {
      followers: userArrOther,
      following: userArr
    }

    returnData = await dataManager.updateFollowers(req.body.username, req.body.usernameOther, updateData)
  }

  res.send({ followerArr: returnData.followers })
});

app.post('/UserCreateAccount', async (req, res) => { //Get Event
  var inputDict = req.body;
  console.log("Create account request!")
  console.log(req.body)
  console.log(req.body.email)
  const CreateResult = dataManager.addUser(req.body.email, req.body.username, req.body.password)
  if (CreateResult == -1) {
    res.send(JSON.stringify({ IsSuccessful: false })) //was not able to create account, because one with given username already exists
  } else {
    res.send(JSON.stringify({ IsSuccessful: true })) //acount successfully created
  }
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

/*-----------PET FUNCTIONS----------*/

app.get('/getUserPets', async (req, res) => { // returns an array of the users pets
  console.log(req.query)
  const petList = await dataManager.getUserPets(req.query.username)
  res.send(petList)
});

app.get('/getPetPic', async (req, res) => { //returns the picture associated with the sepcified pet
  console.log(req.query)
  let imagePath = "/petpics/" + req.query.imagePath
  res.sendFile(imagePath, { root: __dirname });
});

app.post('/Pets', pet_upload.single('petimage'), async (req, res) => { // creates pet entry
  console.log("Creating Pet!")
  console.log(req.file)
  console.log(req.body.PetType)
  console.log(req.body.PetName)
  console.log(req.body.PetDescription)
  console.log(req.body.userIndex)
  console.log("----------------------")

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

app.put('/Pets', pet_upload.single('petimage'), async (req, res) => { // updates an exisiting pet
  console.log("Updating Pet!")
  console.log(req.file)
  console.log(req.body.PetType)
  console.log(req.body.PetName)
  console.log(req.body.PetDescription)
  console.log(req.body.petId)
  console.log(req.body.fileRemoved)
  console.log("----------------------")

  let oldPetEntry = await dataManager.getPet(req.body.petId)

  if (!oldPetEntry)
    res.send({ returnValue: false })

  if ((oldPetEntry.PetImage && req.body.fileRemoved === 'true') || (req.file))
  {
    const imagePath = __dirname + "/petpics/" + oldPetEntry.PetImage

    if (oldPetEntry.PetImage.length > 3)
      fs.exists(imagePath,  (exists) => {
        if (exists)
          fs.unlinkSync(imagePath)
      });
  }

  var petImageTemp = oldPetEntry.PetImage

  if (req.file)
  {
    petImageTemp = req.file.filename
  }  else if(req.body.fileRemoved === 'true')
  {
    petImageTemp = ""
  }
  const petEntry = {
    PetId: req.body.petId,
    PetType: req.body.PetType,
    PetName: req.body.PetName,
    PetDescription: req.body.PetDescription,
    PetImage: petImageTemp
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

app.delete('/Pets', async (req, res) => { // delete a pet
  console.log(req.query)
  let petEntry = await dataManager.getPet(req.query.petId)

  if (!petEntry)
    res.send({ returnValue: false })

  if (petEntry.PetImage != "")
  {
    const imagePath = __dirname + "/petpics/" + petEntry.PetImage
    if (petEntry.PetImage.length > 3)
      fs.exists(imagePath,  (exists) => {
        if (exists)
          fs.unlinkSync(imagePath)
      });

  }

  let ret = await dataManager.deletePet(req.query.petId, req.query.userIndex)
  res.send({ returnValue: ret })
});

/*--------------------------------*/

// Post functions

app.post('/UserCreatePost', post_upload.single('postimage'), async (req, res) => { //Get Event
  console.log("Creating Post!")
  console.log(req.file)
  const postEntry = {
    username: req.body.userIndex,
    postDescription: req.body.PostDescription,
    postLikes: 0,
    postImage: ((req.file) ? req.file.filename : "")
  }

  const postId = await dataManager.addPost(postEntry, req.body.userIndex);
  let fileP = ""

  if (req.file)
    fileP = req.file.filename

 returnPost = {
    username: req.body.userIndex,
    postId: postId,
    postDescription: req.body.PostDescription,
    postLikes: 0,
    postImage: fileP
  }
  res.send(JSON.stringify(returnPost));
});


app.get('/getUserPosts', async (req, res) => { //Get Event
  const postList = await dataManager.getUserPosts(req.query.username)
  res.send(postList)
});

app.get('/getPostList', async (req, res) => { //Get Event
  const postListData = await dataManager.getPostList()
  res.send(postListData)

});


app.get('/getPostPic', async (req, res) => { //Get Event
  if (req.query.imagePath) {
    let imagePath2 = "/postpics/" + req.query.imagePath
    let checkPath = __dirname + imagePath2

    fs.exists(checkPath,  (exists) => {
      if (exists)
        res.sendFile(imagePath2, { root: __dirname });
      else {
        console.log("ERROR " + imagePath2)
        res.send({result: false})
      }
    });
  }
  else {
    res.send({result: false})
  }

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
  res.send(JSON.stringify({ loginStatus: "ohh yea", errorMessage: 'No Errors!' }));

});

app.post('/updateLikedPosts', upload.single('image'), async (req, res) => { //Get Event
  dataManager.updateLikedPosts(req.body.postId, req.body.userId);
  res.send(JSON.stringify({ loginStatus: "ohh yea", errorMessage: 'No Errors!' }));

});

app.post('/UpdatePostLikes', upload.single('image'), async (req, res) => {

  const postInfo = {
    postId: req.body.postId,
    postLikes: req.body.postLikes
  }


  dataManager.updateLikes(postInfo);
  res.send(JSON.stringify({ loginStatus: "ohh yea", errorMessage: 'No Errors!' }));

});

app.post('/DecreaseLikes', upload.single('image'), async (req, res) => {

  const postInfo = {
    postId: req.body.postId,
    postLikes: req.body.postLikes
  }


  dataManager.decreaseLikes(postInfo);

  res.send(JSON.stringify({ loginStatus: "ohh yea", errorMessage: 'No Errors!' }));

});

app.delete('/DeletePost', async (req, res) => { //Get Event
  let postEntry = await dataManager.getPost(req.query.postId)

  if (!postEntry)
    res.send({ returnValue: false })

  if (postEntry.postImage != "")
  {
    const imagePath = __dirname + "/postpics/" + postEntry.postImage
    if (postEntry.postImage.length > 3)
      fs.exists(imagePath,  (exists) => {
        if (exists)
          fs.unlinkSync(imagePath)
      });

  }
  let ret = await dataManager.deletePost(req.query.postId, req.query.userIndex)
  res.send({ returnValue: ret })
});

app.delete('/DecreaseLikedPosts', upload.single('image'),async (req, res) => { //Get Event
  await dataManager.deleteLiked(req.body.postId, req.body.userId)
});



app.get('/getPostArr', async (req, res) => { //Get Event
  const postListData = await dataManager.getPostList()
  res.send({ express: 'heye from Express', postList: JSON.stringify(postListData)  });
});

app.post('/UserCreateComment', upload.single('image'), async (req, res) => { //Get Event

  const commentEntry = {
    username: req.body.userIndex,
    commentDescription: req.body.commentDescription,

  }
  const commentId = await dataManager.addComment(commentEntry, req.body.postIndex);


 returnComment = {
    commentId: commentId,
    username: req.body.userIndex,
    commentDescription: req.body.commentDescription,
  }
  res.send(JSON.stringify(returnComment));
});

app.delete('/DeleteComment', async (req, res) => { //Get Event
  let commentEntry = await dataManager.getComment(req.query.commentId)

  if (!commentEntry)
    res.send({ returnValue: false })


  let ret = await dataManager.deleteComment(req.query.commentId, req.query.postIndex)
  res.send({ returnValue: ret })
});

dataManager.setupMongo().catch(err => console.log(err)); //Initialize the DataBase in the data-manager modules
app.listen(port, () => console.log(`Server Up! Listening on port ${port}`)); //Binds server to localhost:5000
