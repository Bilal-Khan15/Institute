var exports = module.exports = {},
    constants = require('../utils/constant'),
    userModel = require ('../models/user');

const user = require('../models/user.js')
var validator = require('validator');
let admin = require('firebase-admin');
    
const addResource = (Title,Description, Grade, Subject ,TeacherId, author , file='', video_url='', tags='') => {
    try{
        user.db.collection('Resources').add({
            Description,
            Grade,
            TeacherId,
            Subject,
            Title,
            author,
            file,
            time: Date.now(),
            video_url,
            isArchive: false,
            tags
        })
        .then((doc)=>{
            if(video_url == ''){
                user.bucket.upload(file, {
                    gzip: true,
                    // destination: 'Bilal/' + file,
                    metadata: {
                      cacheControl: 'public, max-age=31536000',
                    }
                  }, function(err, file, apiResponse) {
                      user.db.collection('Resources').doc(doc.id).set({video_url: apiResponse.mediaLink}, {merge: true});
                  });
                }
            user.db.collection('Resources').doc(doc.id).set({Uid: doc.id}, {merge: true});
            console.log('doc ===>', doc.id)
            let ResourceID = doc.id
            user.db.collection('Teachers').doc(TeacherId).get()
            .then((res)=>{
                let userData = res.data()
                // let Resource = []
                // Resource.push(ResourceID)
                console.log('resources ===>',userData.Resources)
                userData.Resources ? userData.Resources = [...userData.Resources, ResourceID] : userData.Resources =[ResourceID]
                user.db.collection('Teachers').doc(TeacherId).set(userData)
                .then(()=>console.log('added Resource'))
                .catch((e)=>console.log(e))
            })
            .catch((e) => console.log(e))
        })
        .catch((e) => console.log(e))
    } catch (e) {
        console.log(e);
        throw new Error(e)
    }
}
    
const addtag = (Subject, Class) => {
    try{
        if(!Subject == ''){
            user.db.collection('tags').doc('resources').update({
                subject: admin.firestore.FieldValue.arrayUnion(Subject)
            })
        }
        if(!Class == ''){
            user.db.collection('tags').doc('resources').update({
                class: admin.firestore.FieldValue.arrayUnion(Class)
            })
        }
    } catch (e) {
        console.log(e);
        throw new Error(e)
    }
}

// addResource('testtitle','This math video of base powers.', '2nd year','CS','oi54FJxirqWa4NfOK4RKPch6El23','testauthor','NS','https://www.youtube.com/watch?v=L2zsmYaI5ww')

const signupParent = (type, Name, NIC, Address, Phone, Email, Date, Month, Year, Uid) => {
    try{
        user.db.collection(type).doc(Uid).set({
            type,
            Name,
            NIC,
            Address,
            Phone, 
            Date,
            Month,
            Year,
            Email,
            Uid
        })
    } catch (e) {
        console.log(e);
        throw new Error(e)
    }
}

const signupTeacher = (type, Name, NIC, Address, Phone, Email, Date, Month, Year,Uid, qualification) => {
    try{
        user.db.collection(type).doc(Uid).set({
            type,
            Name,
            NIC,
            Address,
            Phone,
            Email,
            Date,
            Month,
            Year,
            Uid,
            qualification
        })
    } catch (e) {
        console.log(e);
        throw new Error(e)
    }
}

const signupStudent = (type, Name, GuardianName, GuardianPhone, StudentPhone, School, Address, GuardianEmail, GuardianNIC, Date, Month, Year, StudentEmail, Uid) => {
    try{
        user.db.collection(type).doc(Uid).set({
            type,
            Name,
            GuardianName,
            GuardianPhone,
            StudentPhone,
            School,
            Address,
            GuardianEmail,
            GuardianNIC,
            Date,
            Month,
            Year,
            StudentEmail,
            Uid
        })
    } catch (e) {
        console.log(e);
        throw new Error(e)
    }
}

module.exports = {
    addResource: addResource,
    addtag: addtag,
    signupParent: signupParent,
    signupTeacher: signupTeacher,
    signupStudent: signupStudent
}