// getting-started.js
const mongoose = require('mongoose');

const mongoPass = require('./mongo-pass.js');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: String,
  entityType: String, //whether they're a pet owner, event organizer, etc.
  password: String,
  aboutMe: String,
  ownerName: String, //AKA displayName
  pets: Array,
  posts: Array,
  allPosts: Array,
  likedPosts: Array,
  userComments: Array,
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

const postSchema = new mongoose.Schema({
  username: String,
  postId: String,
  postDescription: String,
  postImage: String,
  DisplayImage: String,
  postLikes: { type: Number, default: 0 },
  postComments: Array
});

var commentSchema = new mongoose.Schema({
  username: String,
  commentId: String,
  commentDescription: String
});

//export our module to use in server.js


const PetM = mongoose.model("Pets", petSchema)
const UserM = mongoose.model('Users', userSchema);
const PostM = mongoose.model('Posts', postSchema);
const CommentM = mongoose.model('Comments', commentSchema);


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

exports.getUser =  async function (usrIndex) { //Getter function template
  console.log("Getting user");
  console.log(usrIndex)

  let docs = await UserM.find({ username:usrIndex });
  console.log("--------DOCS-----------")
  console.log(docs)
  console.log("------------------")
  return  docs;
}

exports.getUserLiked =  async function (usrIndex) { //Getter function template
  console.log("Getting user");
  console.log(usrIndex)

  let docs = await UserM.findOne({ username:usrIndex });
  console.log("--------hehehe-----------")
  console.log(docs.likedPosts)
  console.log("------------------")
  return docs.likedPosts;
}

exports.getUserData =  async function (usrIndex) { //Get the data of a single specified user
  console.log("Getting user data");
  console.log(usrIndex)

  let docs = await UserM.findOne({ username:usrIndex });
  return  docs;
}

exports.getUserList =  async function (searchParams) { // get a list of max length 5 based on search parameters
  console.log("Getting user list");
  console.log(searchParams)
  const regExVar = "/"+searchParams+"/"
  let docs = await UserM.find({ username:{ $regex: new RegExp('^' + searchParams , 'i') } }).limit(5);
  console.log("--------DOCS-----------")
  console.log(docs)
  console.log("------------------")
  return  docs;
}

exports.checkIfUserExists = async function (usrNameV) {
  if (await UserM.findOne({ username: usrNameV }) != null) { //check if the user already exists
    console.log("Username DOES exist: ", usrNameV)
    return true;
  } else {
    console.log("Username doesn't exist: ", usrNameV)
    return false;
  }
}

exports.addUser = async function (usrEmailV, usrNameV, usrPasswordV) {
  console.log("Attempting to add user");

  if (await exports.getUserData(usrNameV) != null) { //check if the user already exists
    console.log("USER ALREADY EXISTS! USER WON'T BE ADDED!")
    return -1;
  }
  console.log("Username not taken! Will add user:", usrNameV)

  const userEntry = new UserM({email: usrEmailV, username: usrNameV, password: usrPasswordV}); //Create a model (documet) for user

  await userEntry.save(); //Save to our database

  const userss = await UserM.find(); //Trying to retrieve all the Users collection  documents.
  console.log(userss);
  console.log(userEntry);
}

exports.moreInfoCreateUpdateUser = function (userInfo) { //Function will be used for updating existing users data
  console.log("Updating user");
   UserM.findOneAndUpdate({username: userInfo.username},{entityType: userInfo.entityType, ownerName: userInfo.ownerName, aboutMe: userInfo.aboutMe},function(error,result){
     if(error){
       console.log("Error: ", error)
     }else{
       console.log(result);
     }
   });
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
exports.createPet = async function(petEntry, usrIndx)  { // adds a new pet entry to database
  petId = ""
  let isExist = false
  do
  {
      petId = await crypto.randomBytes(20) // generate a random hash for the pet key
      petId = petId.toString('hex')

      isExist = await PetM.exists({ PetId: petId }); // check if such a hash already exists

      if (!isExist) // if it doesn't exit, then
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

exports.getPet = async function (petId) { // return a specified pet entry
  let docs = await PetM.findOne({ PetId:petId });
  return  docs;
}

exports.getUserPets = async function (usrIndex) { // return an array of the users pets
  let docs = await UserM.findOne({ username:usrIndex });
  petArr = []

  for (let i of docs.pets)
  {
    let petEntry = await PetM.findOne({ PetId:i });
    petArr.push(petEntry)
  }
  return  petArr;
}

exports.updatePet = async function(petInfo, petId) { // update an exisiting pet
  console.log(petInfo)
  console.log(petId)
  await PetM.findOneAndUpdate({PetId:petId}, petInfo);
  return true
}

exports.deletePet = async function(petId, userIndex) { // delete a pet
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

// Post functions

exports.addPost = async function (postEntry, usrIndx) {
  postId = ""
  let isExist = false
  do
  {
      postId = await crypto.randomBytes(20)
      postId = postId.toString('hex')
      isExist = await PostM.exists({ postId: postId });

      if (!isExist)
      {
        postEntry["postId"] = postId
        postEntry["postLikes"] = 0
        const postDatEntry = new PostM(postEntry)

        await postDatEntry.save()
        let docs = await UserM.findOne({ username:usrIndx });
        newPostList = docs.posts
        newPostList.push(postId)
        let totalPosts = await PostM.find();
        totalPostList = totalPosts
        totalPostList.push(postDatEntry)
          
        UserM.findOneAndUpdate({username:usrIndx},{posts: newPostList}, {allPosts: totalPostList},(error,result) => {
          if(error){
            console.log("Error: ", error)
          }else{
            console.log(result);
          }
        });

        break
      }
  } while (isExist)

  return postId
}

exports.getPost = async function (postId) {
  let docs = await PostM.findOne({ postId:postId });
  return  docs;
}

exports.getPostLikes = async function (postId) {
  let docs = await PostM.findOne({ postId:postId });
  likes = docs.postLikes
  return  likes;
}

exports.updatePost = async function(postInfo, postId) {
  await PostM.findOneAndUpdate({postId:postId}, postInfo);
  return true
}

exports.getUserPosts = async function (usrIndex) {
  let docs = await UserM.findOne({ username:usrIndex });
  postArr = []

  for (let i of docs.posts)
  {
    let postEntry = await PostM.findOne({ postId:i });
    postArr.push(postEntry)
  }

  return postArr;
}

exports.updateLikedPosts = async function (postIndex, usrIndex) {
  let postDocs = await PostM.findOne({ postIndex:postIndex });
  let docs = await UserM.findOne({ username:usrIndex });
  newLikedList = docs.likedPosts
  newLikedList.push(postIndex)
  console.log("worked")
  console.log(postIndex)
  UserM.findOneAndUpdate({username: usrIndex}, {likedPosts: newLikedList},function(error,result){
    if(error){
      console.log("Error: ", error)
    }else{
      console.log(result);
      console.log("hello")
    }
  });

}


exports.updateLikes = function (postInfo) { //Function will be used for updating existing users data
  console.log("Updating post");
   PostM.findOneAndUpdate({postId: postInfo.postId}, {$inc : {'postLikes' : 1}},function(error,result){
     if(error){
       console.log("Error: ", error)
     }else{
       console.log(result);
       console.log("hello")
     }

   });

  }

exports.decreaseLikes = function (postInfo) { //Function will be used for updating existing users data
    console.log("Updating post");
    console.log(postInfo.postId)
     PostM.findOneAndUpdate({postId: postInfo.postId}, {$inc : {'postLikes' : -1}},function(error,result){
       if(error){
         console.log("Error: ", error)
       }else{
         console.log(result);
       }
     });
  }

  exports.getPostData =  async function (postIndex) { //Getter function template
    console.log(postIndex)
  
    let docs = await PostM.findOne({ postId:postIndex });
    return  docs;
  }

  exports.getPostList =  async function () { //Getter function template
    console.log("Getting post list");
    let docs = await PostM.find();
    console.log("--------DOCS-----------")
    console.log(docs)
    console.log("------------------")
    return  docs;
  }

exports.deletePost = async function(postId, userIndex) {
  let ret = await PostM.findOneAndRemove({postId:postId});
  let docs = await UserM.findOne({ username:userIndex });

  let index = -1
  for (let i = 0; i < docs.posts.length; i++) {
    if (postId == docs.posts[i]){
      index = i
      break
    }
  }
  if (index > -1)
    docs.posts.splice(index, 1);

  UserM.findOneAndUpdate({username:userIndex},{posts: docs.posts},(error,result)=>{console.log("Successfully Updated User Post Deletion!")})

  return ret;
}

exports.deleteLiked = async function(postId, userIndex) {
  let docs = await UserM.findOne({ username:userIndex });

  let index = -1
  for (let i = 0; i < docs.likedPosts.length; i++) {
    if (postId == docs.likedPosts[i]){
      index = i
      break
    }
  }
  if (index > -1)
    docs.likedPosts.splice(index, 1);

  UserM.findOneAndUpdate({username:userIndex},{likedPosts: docs.likedPosts},(error,result)=>{console.log("Successfully Updated User Post Deletion!")})
}

// Comment functions

exports.addComment = async function (commentEntry, postIndx) {
  commentId = ""
  let isExist = false
  do
  {
      commentId = await crypto.randomBytes(20)
      commentId = commentId.toString('hex')
      isExist = await CommentM.exists({ commentId: commentId });

      if (!isExist)
      {
        commentEntry["commentId"] = commentId
        const commentDatEntry = new CommentM(commentEntry)

        await commentDatEntry.save()
        let docs = await PostM.findOne({ postId:postIndx });
        newCommentList = docs.postComments
        newCommentList.push(commentDatEntry)


        PostM.findOneAndUpdate({postId:postIndx},{postComments: newCommentList}, (error,result) => {
          if(error){
            console.log("Error: ", error)
          }else{
            console.log(result);
          }
        });

        break
      }
  } while (isExist)

  return commentId
}


exports.deleteComment = async function(commentId, postIndex) {
  let ret = await CommentM.findOneAndRemove({commentId:commentId});
  let docs = await PostM.findOne({ postId:postIndex });

  let index = -1
  for (let i = 0; i < docs.postComments.length; i++) {
    if (commentId == docs.postComments[i].commentId){
      index = i
      break
    }
  }
  if (index > -1)
    docs.postComments.splice(index, 1);

  PostM.findOneAndUpdate({postId:postIndex},{postComments: docs.postComments},(error,result)=>{console.log("Successfully Updated User Post Deletion!")})

  return ret;
}

exports.getComment = async function (commentId) {
  let docs = await CommentM.findOne({ commentId:commentId });
  return  docs;
}
