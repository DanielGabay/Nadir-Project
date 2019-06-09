<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://github.com/DanielGabay/Nadir-Project/blob/master/src/images/logo.png" alt="Nadir Project logo"></a>
</p>

<h3 align="center">Nadir Project</h3>

<div align="center">

  [![Status](https://img.shields.io/badge/status-active-success.svg)]() 
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="left"> 
Our project provides a cross platfrom (Windows,MAC & Linux) Desktop application for the "Nadir Project" association.
</p>

## 📝 Table of Contents
- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [Authors](#authors)

## 🧐 About <a name = "about"></a>
The main purpose of the application is to enable a convenient management of members in the organization using a firebase database.
<br>
The application enables the owner a way to:
<br>
1) Add/Search/Remove members from the database <br>
2) Display & edit info about a specific member
3) Add a personal tracking about a member/group
4) Divide the members into groups <br>
5) Payment tracking of each member and group <br>
6) Graduates archive <br>
    <br> 

## 🏁 Getting Started <a name = "getting_started"></a>
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites
To clone and run this repository you'll need Git and Node.js (which comes with npm) installed on your computer. From your command line:

```
# Clone this repository
git clone https://github.com/DanielGabay/Nadir-Project.git
# Go into the repository
cd Nadir-Project
# Install dependencies
npm install
```

you'll need to add a config.js to Nadir-Project/src/js path that initilaize your firebase database.

```
# the config.js file should contain only this:
var config = {
    apiKey: "xxxxxx",
    authDomain: "xxxxxxx.firebaseapp.com",
    databaseURL: "https://xxxxxxx.firebaseio.com",
    projectId: "xxxxxxxx",
    storageBucket: "xxxxxxxx.appspot.com",
    messagingSenderId: "xxxxxxxxx"
};

firebase.initializeApp(config);
```

```
# Run the app
npm start
```

## 🎈 Usage <a name="usage"></a>
The app was designed for a closed usage within the Nadir-project workers. <br>
The app doesn't have a functionality to add users that can logged in to the system, so users must create manually from firebase console <br>
After adding an auth users, when the app loads you'll just need to fill a valid email & password in order to login. <br>
On the navbar under "חניכים" you can add members by choosing "הוסף חניך" and filling up the form. <br>
Then search for the member under "חיפוש חניך".

## 🚀 Deployment <a name = "deployment"></a>
To get a realse-build of your app you'll need to change the icons on src/icons for win/mac/linux to your app logo, and after that run the following scripts:
```
# Packaging for windows:
npm run package-win
# Packaging for mac:
npm run package-mac
# Packaging for linux:
npm run package-linux
```

## ⛏️ Built Using <a name = "built_using"></a>
- [Firebase](http://firebase.google.com) - Database
- [Electron](https://electronjs.org/) - Desktop application Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors"></a>
- [Daniel Gabay](https://github.com/DanielGabay)
- [Shachar Israeli](https://github.com/shachar-israeli)
- [Esty Kolin](https://github.com/estyKolin)
- [Guy Udi](https://github.com/guuy1)
- [Sarai Zarbib](https://github.com/saraize)

