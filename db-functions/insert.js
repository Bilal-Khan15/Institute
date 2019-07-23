var exports = module.exports = {},
    constants = require('../utils/constant'),
    userModel = require ('../models/user');

const db = require('../models/user.js')
var validator = require('validator');
    
const addResource = (Title,Description, Grade, Subject ,TeacherId, author , file,video_url) => {
    try{
        db.collection('Resources').add({
            Description,
            Grade,
            TeacherId,
            Subject,
            Title,
            author,
            file,
            time: Date.now(),
            video_url,
            isArchive: false 
        })
        .then((doc)=>{
            console.log('doc ===>', doc.id)
            let ResourceID = doc.id
            db.collection('Teachers').doc(TeacherId).get()
            .then((res)=>{
                let userData = res.data()
                // let Resource = []
                // Resource.push(ResourceID)
                console.log('resources ===>',userData.Resources)
                userData.Resources ? userData.Resources = [...userData.Resources, ResourceID] : userData.Resources =[ResourceID]
                db.collection('Teachers').doc(TeacherId).set(userData)
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

// addResource('testtitle','This math video of base powers.', '2nd year','CS','oi54FJxirqWa4NfOK4RKPch6El23','testauthor','NS','https://www.youtube.com/watch?v=L2zsmYaI5ww')

const signupParent = (type, Name, NIC, Address, Phone, Email, Uid) => {
    try{
        db.collection(type).doc(Uid).set({
            type,
            Name,
            NIC,
            Address,
            Phone,
            Email
        })
    } catch (e) {
        console.log(e);
        throw new Error(e)
    }
}

const signupTeacher = (type, Name, NIC, Address, Phone, Email, Date, Month, Year,Uid) => {
    try{
        db.collection(type).doc(Uid).set({
            type,
            Name,
            NIC,
            Address,
            Phone,
            Email,
            Date,
            Month,
            Year
        })
    } catch (e) {
        console.log(e);
        throw new Error(e)
    }
}

const signupStudent = (type, Name, GuardianName, GuardianPhone, StudentPhone, School, Address, GuardianEmail, GuardianNIC, Date, Month, Year, StudentEmail, Uid) => {
    try{
        db.collection(type).doc(Uid).set({
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
            StudentEmail
        })
    } catch (e) {
        console.log(e);
        throw new Error(e)
    }
}

module.exports = {
    addResource: addResource,
    signupParent: signupParent,
    signupTeacher: signupTeacher,
    signupStudent: signupStudent
}