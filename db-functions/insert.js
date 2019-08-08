var exports = module.exports = {},
    constants = require('../utils/constant'),
    userModel = require ('../models/user');

const user = require('../models/user.js')
var validator = require('validator');
let admin = require('firebase-admin');
    
const addAnnouncement = (type ,teacher_id , title, marks, description, attachment, suggestion=[], subject, section=[], grade=[]) => {
    return new Promise((resolve, reject) => {
        let ret = []
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        currentTime = mm + '/' + dd + '/' + yyyy;
        const date = new Date(currentTime);
        var time = date.getTime()

        try{
            user.db.collection('announcements').add({
                type, 
                teacher_id,
                title, 
                marks, 
                description,
                time, 
                attachment, 
                suggestion, 
                subject, 
                section, 
                grade
            })
            .then((doc)=>{
                if(attachment){
                    user.bucket.upload(attachment, {
                        gzip: true,
                        // destination: 'Bilal/' + file,
                        metadata: {
                          cacheControl: 'public, max-age=31536000',
                        }
                      }, function(err, file, apiResponse) {
                          user.db.collection('announcements').doc(doc.id).set({attachment: apiResponse.mediaLink}, {merge: true});
                      });
                    }
                    ret.push(time, doc.id)
                    user.db.collection('announcements').doc(doc.id).set({id: doc.id}, {merge: true})
                    .then(() => resolve(ret))
                    .catch((e)=>console.log(e))
            })
            .catch((e) => console.log(e))
        } catch (e) {
            console.log(e);
            throw new Error(e)
        }
    })
}
    
const addResource = (title,description, grade, subject ,teacher_id, author , file='', video_url='', tags='') => {
    return new Promise((resolve, reject) => {
        let ret = []
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        currentTime = mm + '/' + dd + '/' + yyyy;
        const date = new Date(currentTime);
        var time = date.getTime()

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
                    user.bucket.upload(file.path, {
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
    signupStudent: signupStudent,
    addAnnouncement: addAnnouncement
}