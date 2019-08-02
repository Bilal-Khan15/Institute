// process.env.GCLOUD_PROJECT = "website-ngo98";
// process.env.GCLOUD_PROJECT = JSON.parse(process.env.FIREBASE_CONFIG).projectId

var admin = require("firebase-admin");


// var serviceAccount = require("serviceAccountKey.json");
var serviceAccount = require("service_account_key.json");
// const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);

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


