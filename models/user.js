var admin = require("firebase-admin");

var serviceAccount = require("service_account_key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://website-ngo98.firebaseio.com",
    storageBucket: "website-ngo98.appspot.com"
});

const db = admin.firestore();

var bucket = admin.storage().bucket();

module.exports = {
    db: db,
    bucket: bucket
}