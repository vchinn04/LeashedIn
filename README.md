![LeashedInLogoReadMe](https://user-images.githubusercontent.com/72171345/205145514-2175a6e6-044f-4f84-959a-ef069ac2bbd0.png)
# LeashedIn
LeashedIn is a full-stack app designed for the wonderful world of pets. It is a platform for pet owners, charities, event organizers, stores, and shelters to gather and talk about their favorite animals. Post your own message onto the public feed, view user profiles and their pets, and search up other owners or organizations. Join the petwork today!

# Installation and Run Guide
**First ```clone``` the repository like so:** <br />
```sh
git clone https://github.com/vchinn04/LeashedIn
```
<br />

**And ```cd``` into the created directory:** <br />
```sh
cd LeashedIn 
```
<br />

**Next run ```npm install``` in the ```LeashedIn``` and ```client``` directories and ```cd``` back to ```LeashedIn```:** <br />
```sh
npm install
cd client 
npm install 
cd ..
```
<br />

**Lastly, ```cd``` into the ```server``` directory and create a ```.env``` file and ```cd``` back to ```LeashedIn```. Inside this file is the key needed to access the MongoDB. Here is the format:**

```sh
cd server
touch .env
```

**Inside ```.env```:**

```sh
ATLAS_PASS="mongodb+srv://username:password@cluster0.pyvzkqi.mongodb.net/?retryWrites=true&w=majority"
```
**Back to the ```LeashedIn``` directory:**

```sh
cd ..
```

<br />

**Now you are ready to run the project! Just use this command in the ```LeashedIn``` directory:** <br />
```sh
npm run dev
```

# Features
LeashedIn offers several distinct features. Users first create their account, where they must provide a unique username (the create account page tells them if a username is already taken). Their information is stored onto the server, and they may then login. LeashedIn displays dynamic data, most notably through posts. Users who refresh the page after a new post is added will see it on their updated feed. Furthermore, the user may interact with the post by commenting on it or liking it. Every user has a profile page where they may modify the information that’s public to other users. A user may modify their profile picture, name, about me section, and add/remove pets. Each pet has their own description too. The user may search for other users through the search bar at the top, and can view that profile’s information. Finally, users may also follow other users they feel are important. They can also view the users that other people folllow and the users that follow those people. With these features, LeashedIn shows its robustness as a pet social network.

# Credits and Acknowledgements
The technologies we used were [React](https://reactjs.org/), [Node.js](https://nodejs.org/en/), [ExpressJS](https://expressjs.com/), and [MongoDB](https://www.mongodb.com/home) and [mongoose](https://mongoosejs.com/), [React-Router](https://reactrouter.com/en/main).

Middlewares: [multer](https://www.npmjs.com/package/multer), [bodyParser](https://www.npmjs.com/package/body-parser)

Libraries: [Material UI](https://mui.com/), [React-Bootstrap](https://react-bootstrap.github.io/), [styled-components](https://styled-components.com/), [react-select](https://react-select.com/home)

# Contributors
[Victor Chinnappan](https://github.com/vchinn04) <br />
[Keyana Desai](https://github.com/kdesai52) <br />
[Dung Quang Ngo](https://github.com/vaultdweller101) <br />
[Felix Qu](https://github.com/fequ830)

