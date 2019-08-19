var admin = require("firebase-admin");
var serviceAccount = require("../website-ngo98-firebase-adminsdk-vxw7y-0b58171e63.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://website-ngo98.firebaseio.com",
    storageBucket: "website-ngo98.appspot.com",
    projectId: 'website-ngo98'
});

const db = admin.firestore();

var bucket = admin.storage().bucket();

module.exports = {
    db: db,
    bucket: bucket
}
