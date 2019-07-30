var exports = module.exports = {},
    constants = require('../utils/constant'),
    userModel = require ('../models/user');

const user = require('../models/user.js')
var validator = require('validator');
let admin = require('firebase-admin');
    
const addResource = (title,description, grade, subject ,teacher_id, author , file='', video_url='', tags='') => {
    return new Promise((resolve, reject) => {
        let ret = []
        let time = Date.now()
        let is_archive = false
        try{
            user.db.collection('resources').add({
                description,
                grade,
                teacher_id,
                subject,
                title,
                author,
                file,
                time,
                video_url,
                is_archive,
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
                          user.db.collection('resources').doc(doc.id).set({file: apiResponse.mediaLink}, {merge: true});
                      });
                    }
                user.db.collection('resources').doc(doc.id).set({id: doc.id}, {merge: true});
                ret.push(time, is_archive, doc.id)
                let ResourceID = doc.id
                user.db.collection('users').doc(teacher_id).get()
                .then((res)=>{
                    let userData = res.data()
                    userData.resources ? userData.resources = [...userData.resources, ResourceID] : userData.resources =[ResourceID]
                    user.db.collection('users').doc(teacher_id).set(userData)
                    .then(() => resolve(ret))
                    .catch((e)=>console.log(e))
                })
                .catch((e) => console.log(e))
            })
            .catch((e) => console.log(e))
        } catch (e) {
            console.log(e);
            throw new Error(e)
        }
    })
}

// addResource('title','description', 'grade', 'subject' ,'teacher_id', 'author' , file='', video_url='', tags='')

const addtag = (subject, grade) => {
    try{
        if(!subject == ''){
            user.db.collection('tags').doc('resources').update({
                subject: admin.firestore.FieldValue.arrayUnion(subject)
            })
        }
        if(!grade == ''){
            user.db.collection('tags').doc('resources').update({
                grade: admin.firestore.FieldValue.arrayUnion(grade)
            })
        }
    } catch (e) {
        console.log(e);
        throw new Error(e)
    }
}

const signupParent = (type, name, nic, address, phone, email, date, month, year, id) => {
    try{
        user.db.collection('users').doc(id).set({
            type: 'parent',
            name,
            nic,
            address,
            phone, 
            date,
            month,
            year,
            email,
            id
        })
    } catch (e) {
        console.log(e);
        throw new Error(e)
    }
}

const signupTeacher = (type, name, nic, address, phone, email, date, month, year,id, qualification, resources=[]) => {
    try{
        user.db.collection('users').doc(id).set({
            type: 'teacher',
            name,
            nic,
            address,
            phone,
            email,
            date,
            month,
            year,
            id,
            qualification,
            resources
        })
    } catch (e) {
        console.log(e);
        throw new Error(e)
    }
}

const signupStudent = (type, name, guardian_name, guardian_phone, student_phone, school, address, guardian_email, guardian_nic, date, month, year, student_email, id) => {
    try{
        user.db.collection('users').doc(id).set({
            type: 'student',
            name,
            guardian_name,
            guardian_phone,
            student_phone,
            school,
            address,
            guardian_email,
            guardian_nic,
            date,
            month,
            year,
            student_email,
            id
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