var admin = require("firebase-admin");

// var serviceAccount = require("serviceAccountKey.json");
var serviceAccount = require("service_account_key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://testing-31853.firebaseio.com",
    // storageBucket: "testing-31853.appspot.com"
    databaseURL: "https://website-ngo98.firebaseio.com",
    storageBucket: "website-ngo98.appspot.com"
});

const db = admin.firestore();

var bucket = admin.storage().bucket();

module.exports = {
    db: db,
    bucket: bucket
}





// var admin = require('firebase-admin');
// admin.initializeApp();
// const db = admin.firestore();

// module.exports = db



// const start = async function() {
//     const [metadata] = await bucket.file('app.js').getMetadata();
//     console.log(`File: ${metadata.name}`);
//     console.log(`Media link: ${metadata.mediaLink}`);
// }
// start()
