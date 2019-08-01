var admin = require("firebase-admin");


// var serviceAccount = require("serviceAccountKey.json");
var serviceAccount = require("service_account_key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://website-ngo98.firebaseio.com",
    storageBucket: "website-ngo98.appspot.com"
});

const db = admin.firestore();

var bucket = admin.storage().bucket();











// // The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
// const functions = require('firebase-functions');

// // Initialize Algolia, requires installing Algolia dependencies:
// // https://www.algolia.com/doc/api-client/javascript/getting-started/#install
// //
// // App ID and API Key are stored in functions config variables
// const ALGOLIA_ID = functions.config().algolia.app_id;
// const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
// const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key;

// const ALGOLIA_INDEX_NAME = 'notes';
// const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);


// // Update the search index every time a blog post is written.
// exports.onNoteCreated = functions.firestore.document('notes/{noteId}').onCreate((snap, context) => {
//     // Get the note document
//     const note = snap.data();
  
//     // Add an 'objectID' field which Algolia requires
//     note.objectID = context.params.noteId;
  
//     // Write to the algolia index
//     const index = client.initIndex(ALGOLIA_INDEX_NAME);
//     return index.saveObject(note);
//   });
  
  














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


