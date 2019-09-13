var exports = module.exports = {},
    constants = require('../utils/constant'),
    userModel = require ('../models/user');

const user = require('../models/user.js')
var validator = require('validator');
let admin = require('firebase-admin');
const fs = require('fs')
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

const open_invite = (id) => {
    var decrypt = decrypt(id)
    console.log(decrypt)
}

const invite = (email, institute_id) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    currentTime = mm + '/' + dd + '/' + yyyy;
    const date = new Date(currentTime);
    var time = date.getTime()
    encrypted = encrypt(institute_id + time)
    var link = 'http://localhost:8000/invites/' + encrypted

    try{
        user.db.collection('invites').add({
            email,
            institute_id,
            invite_id: encrypted,
            status: 'invited',
            link
        }).then((doc) => {
            user.db.collection('institute_students').add({
                invite_id: encrypted,
            })
        })
    } catch (e) {
            console.log(e);
            throw new Error(e)
    }
}

const addAnnouncement = (due_date, grade_id=[], section_id=[], subject_id ,teacher_id , title, description, attachment, suggestion=[], subject, section=[], grade=[]) => {
    return new Promise((resolve, reject) => {
        let ret = []
        var student_id = []
        user.db.collection('subjects').doc(subject_id).get().then(snapshot => {
            student_id = snapshot.data().student_id
        })
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        currentTime = mm + '/' + dd + '/' + yyyy;
        const date = new Date(currentTime);
        var time = date.getTime()

        try{
            user.db.collection('announcements').add({
                due_date,
                grade_id,
                section_id,
                subject_id,
                student_id,
                type: 'notices', 
                teacher_id,
                title, 
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
                    ret.push(time, doc.id, student_id)
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
                    fs.readFile(file, function (err, data) {
                        const filename = file.split('\\').pop().split('/').pop()
                        const store = './Temp/' + doc.id + filename;
                        fs.writeFile(store, data,async function (err) {
                            if (err) throw err;
                            await user.bucket.upload(store, {
                                gzip: true,
                                // destination: 'Bilal/' + file,
                                metadata: {
                                  cacheControl: 'public, max-age=31536000',
                                }
                              }, function(err, file, apiResponse) {
                                  user.db.collection('resources').doc(doc.id).set({file: apiResponse.mediaLink}, {merge: true});
                                  fs.unlink(store, function (err) {
                                    if (err) throw err;
                                  }); 
                                });                        
                        }); 
                    })
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

const inst_signupParent = (inst_id, inst_name, type, name, nic, address, phone, email, date, month, year, id) => {
    try{
        user.db.collection('institute_parents').doc(id).set({
            institute_id: inst_id,
            institute_name: inst_name,
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

const inst_signupTeacher = (date_of_joining, inst_id, inst_name, type, name, nic, address, phone, email, date, month, year,id, qualification, resources=[]) => {
    try{
        user.db.collection('institute_teachers').doc(id).set({
            date_of_joining,
            institute_id: inst_id,
            institute_name: inst_name,
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

const signupStudent = (type, name, guardian_name, guardian_phone, student_phone, address, guardian_email, guardian_nic, date, month, year, student_email, id) => {
    try{
        user.db.collection('users').doc(id).set({
            type: 'student',
            name,
            guardian_name,
            guardian_phone,
            student_phone,
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
const inst_signupStudent = (student_nic, date_of_joining, inst_id, inst_name, type, name, guardian_name, guardian_phone, student_phone, address, guardian_email, guardian_nic, date, month, year, student_email, id) => {
    try{
        user.db.collection('institute_students').doc(id).set({
            date_of_joining,
            institute_id: inst_id,
            institute_name: inst_name,
            type: 'student',
            name,
            guardian_name,
            guardian_phone,
            student_phone,
            address,
            guardian_email,
            student_nic,
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
    inst_signupParent: inst_signupParent,
    inst_signupTeacher: inst_signupTeacher,
    inst_signupStudent: inst_signupStudent,
    addAnnouncement: addAnnouncement,
    invite: invite,
    open_invite: open_invite
}