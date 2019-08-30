var admin = require("firebase-admin");
var serviceAccount = require("../website-ngo98-firebase-adminsdk-vxw7y-0b58171e63.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://tehreer-3d704.firebaseio.com",
    storageBucket: "tehreer-3d704.appspot.com",
    projectId: 'tehreer-3d704'
});

const db = admin.firestore();

var bucket = admin.storage().bucket();

module.exports = {
    db: db,
    bucket: bucket
}
