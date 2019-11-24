const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const user = require('../models/user.js')
const fs = require('fs')
var validator = require('validator');
var multipart = require('connect-multiparty');

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())   
var multipartMiddleware = multipart();

let router = express.Router(),
    constants = require('../utils/constant'),
    insert = require('../db-functions/insert'),
    db_delete = require('../db-functions/delete'),
    read = require('../db-functions/read'),
    update = require('../db-functions/update'),
    utilsFunction = require('../utils/functions');

/**
 * @api {post}
 * @apiName signup
 
 * "parent"
 * @apiParam {type} 
 * @apiParam {name}
 * @apiParam {nic} 
 * @apiParam {address} 
 * @apiParam {phone} 
 * @apiParam {email} 
 * @apiParam {date} 
 * @apiParam {month} 
 * @apiParam {year} 
 * @apiParam {id} 
 * @apiSuccess {JSON object} 
 
 * "teacher"
 * @apiParam {type} 
 * @apiParam {name}
 * @apiParam {nic} 
 * @apiParam {address} 
 * @apiParam {phone} 
 * @apiParam {email} 
 * @apiParam {date} 
 * @apiParam {month} 
 * @apiParam {year} 
 * @apiParam {id} 
 * @apiParam {qualification} 
 * @apiSuccess {JSON object} 
 
 * "student"
 * @apiParam {type} 
 * @apiParam {name}
 * @apiParam {guardian_name} 
 * @apiParam {guardian_phone} 
 * @apiParam {phone} 
 * @apiParam {address} 
 * @apiParam {guardian_email} 
 * @apiParam {guardian_nic} 
 * @apiParam {date} 
 * @apiParam {month} 
 * @apiParam {year} 
 * @apiParam {email} 
 * @apiParam {id} 
 * @apiSuccess {JSON object} 
 */
app.post('/signup', (req, res) => {
    if (req.body.type == 'parent') {
        if ((req.body.type.trim() == '')
            || (req.body.name.trim() == '') || (!validator.isLength(req.body.name, min = 2, max = undefined))
            || (req.body.pwd.trim() == '') || (!validator.isLength(req.body.pwd, min = 2, max = undefined))
            || (req.body.nic.trim() == '') || (!validator.isLength(req.body.nic, min = 13, max = 16)) || (!validator.isNumeric(req.body.nic))
            || (req.body.address.trim() == '') || (!validator.isLength(req.body.address, min = 5, max = 95))
            || (req.body.phone.trim() == '') || (!validator.isNumeric(req.body.phone)) || (!validator.isLength(req.body.phone, min = 10, max = 15))
            || (req.body.email.trim() == '') || (!validator.isEmail(req.body.email)) || (!validator.isLength(req.body.email, min = 5, max = 320))
            || (req.body.date.trim() == '') || (req.body.month.trim() == '') || (req.body.year.trim() == '')) {
                return res.status(404).send({ error: 'Please fill all the fields properly !' })
            }
        insert.signupParent(req.body.name, req.body.nic, req.body.address, req.body.phone, req.body.email, req.body.date, req.body.month, req.body.year, req.body.pwd)
        res.send({
            result: req.body
        })
    }
    if (req.body.type == 'teacher') {
        if ((req.body.type.trim() == '')
            || (req.body.name.trim() == '') || (!validator.isLength(req.body.name, min = 2, max = undefined))
            || (req.body.pwd.trim() == '') || (!validator.isLength(req.body.pwd, min = 2, max = undefined))
            || (req.body.nic.trim() == '') || (!validator.isLength(req.body.nic, min = 13, max = 16)) || (!validator.isNumeric(req.body.nic))
            || (req.body.address.trim() == '') || (!validator.isLength(req.body.address, min = 5, max = 95))
            || (req.body.phone.trim() == '') || (!validator.isNumeric(req.body.phone)) || (!validator.isLength(req.body.phone, min = 10, max = 15))
            || (req.body.email.trim() == '') || (!validator.isEmail(req.body.email)) || (!validator.isLength(req.body.email, min = 5, max = 320))
            || (req.body.qualification.trim() == '') || (req.body.date.trim() == '') || (req.body.month.trim() == '') || (req.body.year.trim() == '')) {
                return res.status(404).send({ error: 'Please fill all the fields properly !' })
            }
        insert.signupTeacher(req.body.name, req.body.nic, req.body.address, req.body.phone, req.body.email, req.body.date, req.body.month, req.body.year, req.body.pwd, req.body.qualification)
        res.send({
            result: req.body
        })
    }
    if (req.body.type == 'student') {
        if ((req.body.type.trim() == '')
            || (req.body.name.trim() == '') || (!validator.isLength(req.body.name, min = 2, max = undefined))
            || (req.body.pwd.trim() == '') || (!validator.isLength(req.body.pwd, min = 2, max = undefined))
            || (req.body.guardian_name.trim() == '') || (!validator.isLength(req.body.guardian_name, min = 2, max = undefined))
            || (req.body.guardian_phone.trim() == '') || (!validator.isNumeric(req.body.guardian_phone)) || (!validator.isLength(req.body.guardian_phone, min = 10, max = 15))
            || (req.body.phone.trim() == '') || (!validator.isNumeric(req.body.phone))
            || (req.body.address.trim() == '') || (!validator.isLength(req.body.address, min = 5, max = 95))
            || (req.body.guardian_email.trim() == '') || (!validator.isEmail(req.body.guardian_email)) || (!validator.isLength(req.body.guardian_email, min = 5, max = 320))
            || (req.body.guardian_nic.trim() == '') || (!validator.isLength(req.body.guardian_nic, min = 13, max = 16)) || (!validator.isNumeric(req.body.guardian_nic))
            || (req.body.date.trim() == '') || (req.body.month.trim() == '') || (req.body.year.trim() == '')
            || (req.body.email.trim() == '') || (!validator.isEmail(req.body.email)) || (!validator.isLength(req.body.email, min = 5, max = 320))) {
            return res.status(404).send({ error: 'Please fill all the fields properly !' })
        }
        insert.signupStudent(req.body.name, req.body.guardian_name, req.body.guardian_phone, req.body.phone, req.body.address, req.body.guardian_email, req.body.guardian_nic, req.body.date, req.body.month, req.body.year, req.body.email, req.body.pwd)
        res.send({
            result: req.body
        })
    }
})
        
// /**
//  * @api {post}
//  * @apiName addAnnouncement
 
//  *
//  * @apiParam {due_date}
//  * @apiParam {grade_id}
//  * @apiParam {section_id}
//  * @apiParam {subject_id}
//  * @apiParam {teacher_id}
//  * @apiParam {title}
//  * @apiParam {description}
//  * @apiParam {attachment}
//  * @apiParam {suggestion}
//  * @apiParam {subject}
//  * @apiParam {section}
//  * @apiParam {grade}

//  * @apiSuccess {JSON object} 
//  * 
//  */
// app.post('/addAnnouncement', async (req, res) => {
//     if((req.body.teacher_id.trim() == '') 
//         || (req.body.title.trim() == '') || (!validator.isLength(req.body.title, min= 1, max= 60))  
//         || (req.body.description.trim() == '') || (!validator.isLength(req.body.description, min= 0, max= 1000)) 
//         || (req.body.grade_id.trim() == '') || (req.body.section_id.trim() == '') || (req.body.subject_id.trim() == '')  
//         || (req.body.due_date.trim() == '') 
//         || (req.body.subject.trim() == '') 
//         || (req.body.section == []) 
//         || (req.body.grade == [])){
//             return res.status(404).send({ error: 'Please fill all the fields properly !' })
//         }
        
//     ret = await insert.addAnnouncement(req.body.due_date, req.body.grade_id, req.body.section_id, req.body.subject_id, req.body.teacher_id, req.body.title, req.body.description, req.body.attachment, req.body.suggestion, req.body.subject, req.body.section, req.body.grade)

//     req.body.time = ret[0]
//     req.body.id = ret[1]
//     req.body.student_id = ret[2]

//     res.send({
//         result: req.body
//     })
// })

// /**
//  * @api {get}
//  * @apiName announcements
//  *
//  * @apiSuccess {string array} array of announcements
//  */
// app.get('/announcements', (req, res) => {
//     user.db.collection('announcements').get().then(snapshot => {
//         let data = []
//         snapshot.docs.forEach(doc => {
//             data.push(doc.data());
//         });

//         //data = JSON.stringify(data)
//         res.send({
//             resources: data
//         })
//     });
// })

// const addingclass = (snapshot, test) => new Promise((resolve, reject) => {
//     test = []
//     snapshot.docs.forEach(doc => {
//         test.push(doc.data())
//     })
//     resolve(test)
// })

// /**
//  * @api {get}
//  * @apiName json 
//  *
//  * @apiSuccess {JSON object} json object of classes, sections, subjects.
//  */
// app.get('/json', async (req, res) => {
//     var grade = []
//     var sec = []
//     var subj = []
//     await user.db.collection('grades').get().then(async (classes) => {
//         grade = await addingclass(classes, grade)
//     })

//     await user.db.collection('sections').get().then(async (sections) => {
//         sec = await addingclass(sections, sec)
//     })

//     await user.db.collection('subjects').get().then(async (subjs) => {
//         subj = await addingclass(subjs, subj)
//     })

//     await sec.map(g => {
//         var subjects_list = g.subjects
//         g.subjects = []
//         subj.map(s => {
//             subjects_list.map(temp => {
//                 if(temp == s.id)
//                 {
//                     return g.subjects.push(s)
//                 }
//             })
//         })
//     })

//     await grade.map(g => {
//         var sections_list = g.sections
//         g.sections = []
//         sec.map(s => {
//             sections_list.map(temp => {
//                 if(temp == s.id)
//                 {
//                     return g.sections.push(s)
//                 }
//             })
//         })
//     })

//     // grade = await JSON.stringify(grade)
//     res.send(grade)
// })

// const tclasses = (teach, subj) => {
//     user.db.collection('users').doc(teach).get().then(snapshot => {
//         let data = snapshot.data()
//         console.log(data)
//         data.classes ? data.classes = [...data.classes, subj] : data.classes =[subj]
        
//         user.db.collection('users').doc(teach).set(data)
//     })
// }
// // tclasses('wb9QYogCoGbSdwwqRm3L2zxKDnC2', 'GQKaZWMba6gaJI8kfSz2')

// /**
//  * @api {get}
//  * @apiName broadcastAnnouncement
 
//  *
//  * @apiParam {id} id Users unique ID.
//  *
//  * @apiSuccess {String array} array of announcements 
//  * 
//  */
// app.get('/broadcastAnnouncement', async (req, res) => {
//     let gdata = []
//     let sdata = []
//     let data = []
//     await user.db.collection('announcements').doc(req.query.id).get().then(snapshot => {
//         gdata = snapshot.data().grade_id        
//         sdata = snapshot.data().section_id        
//     })

//     // await gdata.map(s => {
//     //     user.db.collection('grades').doc(s).get().then(snapshot => {
//     //         return data.push(snapshot.data())
//     //     })    
//     // })

//     await sdata.map(s => {
//         user.db.collection('sections').doc(s).get().then(snapshot => {
//             return data.push(snapshot.data())
//         })    
//     })

//     res.send({
//         resources: data
//     })
// })

// /**
//  * @api {get}
//  * @apiName myAnnouncements
 
//  *
//  * @apiParam {id} id Users unique ID.
//  *
//  * @apiSuccess {String array} array of announcements 
//  */
// app.get('/myAnnouncements', (req, res) => {
//     let data = []
//     user.db.collection('announcements').where('student_id', 'array-contains', req.query.id).get().then(snapshot => {
//         snapshot.docs.forEach(doc => {
//             data.push(doc.data())
//         })

//         res.send({
//             resources: data
//         })
//     });
// })


// /**
//  * @api {get}
//  * @apiName pAnnouncements
 
//  *
//  * @apiParam {id} id Users unique ID.
//  *
//  * @apiSuccess {String array} array of announcements 
//  */
// app.get('/pAnnouncements', async (req, res) => {
//     let sdata = []
//     let announc = []
//     let data = []
//     await user.db.collection('users').doc(req.query.id).get().then(snapshot => {
//         sdata = snapshot.data().student_id        
//     })

//     await user.db.collection('announcements').get().then((snapshot) => {
//         snapshot.docs.forEach(doc => {
//             announc.push(doc.data())
//         })
//     })    

//     await sdata.map(s => {
//         announc.map(a => {
//             a.student_id.find(d => {
//                 if(d == s){
//                     data.push(a)
//                 }
//             })
//         })
//     })

//     res.send({
//         resources: data
//     })
// })

// /**
//  * @api {post}
//  * @apiName invite
 
//  *
//  * @apiParam {email} 
//  * @apiParam {institute_id} 
//  *
//  * @apiSuccess {JSON object} 
//  * 
//  */
// app.post('/invite', (req, res) => {
//     insert.invite(req.body.email, req.body.institute_id)

//     res.send({
//         result: req.body
//     })
// })


// /**
//  * @api {get}
//  * @apiName GetUser
 
//  *
//  * @apiParam {iv} iv part of decrypt
//  * @apiParam {id} id part of decrypt
//  * @apiParam {email} user email
//  *
//  * @apiSuccess {JSON object} object of passed param
//  */
// app.get('/open_invite', async(req, res) => {
//     email = await insert.open_invite(req.query.iv, req.query.id)
    
//     req.query.email = email

//     res.send({
//         result: req.query
//     })
// })

// /**
//  * @api {post}
//  * @apiName save_invite
 
//  *
//  * @apiParam {email} 
//  * @apiParam {pwd} 
//  * @apiParam {iv} 
//  * @apiParam {id} 
//  *
//  * @apiSuccess {JSON object} 
//  * 
//  */
// app.post('/save_invite', (req, res) => {
//     insert.save_invite(req.body.email, req.body.pwd, req.body.iv, req.body.id)

//     res.send({
//         result: req.body
//     })
// })

// /**
//  * @api {post}
//  * @apiName addResource
 
//  *
//  * @apiParam {title} 
//  * @apiParam {description} 
//  * @apiParam {grade} 
//  * @apiParam {subject} 
//  * @apiParam {teacher_id} 
//  * @apiParam {author} 
//  * @apiParam {file} 
//  * @apiParam {video_url} 
//  * @apiParam {tags} 
//  * 
//  * @apiSuccess {JSON object} 
//  * 
//  */
// app.post('/addResource', async (req, res) => {
//     if((req.body.title.trim() == '') || (!validator.isLength(req.body.title, min= 1, max= 60))  
//         || (req.body.description.trim() == '') || (!validator.isLength(req.body.description, min= 0, max= 1000)) 
//         || (req.body.grade.trim() == '') 
//         || (req.body.subject.trim() == '') 
//         || (req.body.teacher_id.trim() == '') 
//         || (req.body.author.trim() == '') || (!validator.isLength(req.body.author, min= 2, max= undefined))){
//             return res.status(404).send({ error: 'Please fill all the fields properly !' })
//         }

//         ret = await insert.addResource(req.body.title, req.body.description, req.body.grade, req.body.subject, req.body.teacher_id, req.body.author, req.body.file, req.body.video_url, req.body.tags)

//         req.body.time = ret[0]
//         req.body.is_archive = ret[1]
//         req.body.id = ret[2]
    
//         res.send({
//             result: req.body
//         })
// })

// /**
//  * @api {post}
//  * @apiName removeResource
 
//  *
//  * @apiParam {id} id Users unique ID.
//  *
//  * @apiSuccess {String} 
//  * 
//  */
// app.post('/removeResource', (req, res) => {
//     user.db.collection('resources').doc(req.body.id).get().then((res) => {
//         let data = res.data()

//         data.is_archive = true

//         user.db.collection('resources').doc(req.body.id).set(data)
//     })

//     res.send({
//         result: 'Targeted resource has been deleted.'
//     })
// })

// /**
//  * @api {post}
//  * @apiName updateResource
 
//  *
//  * @apiParam {id} 
//  * @apiParam {title} 
//  * @apiParam {description} 
//  * @apiParam {grade} 
//  * @apiParam {subject} 
//  * @apiParam {teacher_id} 
//  * @apiParam {file} 
//  * @apiParam {video_url} 
//  * @apiParam {author} 
//  * @apiParam {time} 
//  * @apiParam {is_archive} 
//  *
//  * @apiSuccess {String} 
//  * 
//  */
// app.post('/updateResource', (req, res) => {
//     user.db.collection('resources').doc(req.body.id).get().then((res) => {
//         let data = res.data()
//         console.log(data)
//         if (req.body.title) {
//             data.title = req.body.title
//         }
//         if (req.body.description) {
//             data.description = req.body.description
//         }
//         if (req.body.grade) {
//             data.grade = req.body.grade
//         }
//         if (req.body.subject) {
//             data.subject = req.body.subject
//         }
//         if (req.body.teacher_id) {
//             data.teacher_id = req.body.teacher_id
//         }
//         if (req.body.file) {
//             data.file = req.body.file
//             data.video_url = ''
//         }
//         else if (req.body.video_url) {
//             data.video_url = req.body.video_url
//             data.file = ''
//         }
//         if (req.body.author) {
//             data.author = req.body.author
//         }
//         if (req.body.time) {
//             data.time = req.body.time
//         }
//         if (req.body.is_archive) {
//             data.is_archive = req.body.is_archive
//         }

//         user.db.collection('resources').doc(req.body.id).set(data)
//     })

//     res.send({
//         result: 'Targeted resource has been Updated.'
//     })
// })

// /**
//  * @api {get}
//  * @apiName library
//  *
//  * @apiSuccess {String array} array of resources
//  */
// app.get('/library', (req, res) => {
//     user.db.collection('resources').get().then(snapshot => {
//         let data = []
//         snapshot.docs.forEach(doc => {
//             if (!doc.data().is_archive) {
//                 data.push(doc.data());
//             }
//         });

//         //data = JSON.stringify(data)
//         res.send({
//             resources: data
//         })
//     });
// })

// function getdate(day)
// {
//     if(day == 'yesterday') { diffDays = 1 } 
//     else if(day == 'last_week') { diffDays = 7 } 
//     else if(day == 'last_month') { diffDays = 31 } 
//     else { return 0 }

//     var today = new Date();
//     var dd = String(today.getDate()).padStart(2, '0');
//     var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
//     var yyyy = today.getFullYear();
//     currentTime = mm + '/' + dd + '/' + yyyy;
//     const date2 = new Date(currentTime);

//     const diffTime = diffDays * (1000 * 60 * 60 * 24);
//     date1 = Math.abs(date2.getTime() - diffTime)
//     return date1 
// }

// /**
//  * @api {post}
//  * @apiName library/filter
 
//  *
//  * @apiParam {subject} 
//  * @apiParam {time} 
//  * @apiParam {grade} 
//  *
//  * @apiSuccess {String array} array of reources 
//  * 
//  */
// app.post('/library/filter', (req, res) => {
//     console.log(req.body.subject)
//     var time = getdate(req.body.time)
//     user.db.collection('resources').where('time', '>=', time).get().then(async (snapshot) => {
//         let data = []
//         await snapshot.docs.forEach(doc => {
//             let chk = false
//             if(req.body.subject != undefined){
//                 req.body.subject.forEach(sub => {
//                     if ((!doc.data().is_archive) && (doc.data().subject.toLowerCase() == sub.label.toLowerCase())) {
//                         data.push(doc.data())
//                         chk = true
//                     }
//                 });
//             }

//             if(req.body.grade != undefined){
//                 req.body.grade.forEach(sub => {
//                     if ((!doc.data().is_archive) && (doc.data().grade.toLowerCase() == sub.label.toLowerCase()) && (!chk)) {
//                         data.push(doc.data())
//                         chk = true
//                     }
//                 });
//             }
//         });

//         if ((req.body.time != undefined) && (req.body.subject == undefined) && (req.body.subject == undefined))
//         {
//             snapshot.docs.forEach((doc) => {
//                 data.push(doc.data())
//             });
//         }

//         res.send({
//             resources: data
//         })
//     });
// })

// /**
//  * @api {get}
//  * @apiName library/myLibrary
 
//  *
//  * @apiParam {id} id Users unique ID.
//  *
//  * @apiSuccess {String array} array of resources
//  */
// app.get('/library/myLibrary', (req, res) => {
//     user.db.collection('resources').where('teacher_id', '==', req.query.id).get().then(snapshot => {
//         let data = []
//         snapshot.docs.forEach(doc => {
//             if (!doc.data().is_archive) {
//                 data.push(doc.data());
//             }
//         });

//         //data = JSON.stringify(data)
//         res.send({
//             resources: data
//         })
//     });
// })

// /**
//  * @api {post}
//  * @apiName library/myLibrary/filter
 
//  *
//  * @apiParam {subject} 
//  * @apiParam {time} 
//  * @apiParam {grade} 
//  *
//  * @apiSuccess {String array} array of reources 
//  * 
//  */
// app.post('/library/myLibrary/filter', (req, res) => {
//     var time = getdate(req.body.time)
//     user.db.collection('resources').where('teacher_id', '==', req.body.id).where('time', '>=', time).get().then(snapshot => {
//         let data = []
//         snapshot.docs.forEach(doc => {
//             let chk = false
//             if(req.body.subject != undefined){
//                 req.body.subject.forEach(sub => {
//                     if ((!doc.data().is_archive) && (doc.data().subject.toLowerCase() == sub.label.toLowerCase())) {
//                         data.push(doc.data())
//                         chk = true
//                     }
//                 });
//             }

//             if(req.body.grade != undefined){
//                 req.body.grade.forEach(sub => {
//                     if ((!doc.data().is_archive) && (doc.data().grade.toLowerCase() == sub.label.toLowerCase()) && (!chk)) {
//                         data.push(doc.data())
//                         chk = true
//                     }
//                 });
//             }
//         });

//         if ((req.body.time != undefined) && (req.body.subject == undefined) && (req.body.subject == undefined))
//         {
//             snapshot.docs.forEach((doc) => {
//                 data.push(doc.data())
//             });
//         }

//         res.send({
//                 resources: data
//         })
//     });
// })

// /**
//  * @api {post}
//  * @apiName addtag
 
//  *
//  * @apiParam {subject} 
//  * @apiParam {grade} 
//  *
//  * @apiSuccess {String} 
//  * 
//  */
// app.post('/addtag', (req, res) => {
//     if ((req.body.subject.trim() == '') && (req.body.grade.trim() == '')) {
//         return res.send({
//             result: 'Please fill all the fields properly !'
//         })
//     }

//     insert.addtag(req.body.subject, req.body.grade)

//     res.send({
//         result: 'Tag has been added.'
//     })
// })

// /**
//  * @api {get}
//  * @apiName tags
 
//  *
//  * @apiParam {Number} id Users unique ID.
//  *
//  * @apiSuccess {String array} array of subject tags
//  * @apiSuccess {String array} array of grade tags
//  */
// app.get('/tags', (req, res) => {
//     user.db.collection('tags').doc('resources').get().then(snapshot => {
//         let sdata = []
//         let cdata = []
//         snapshot.data().subject.forEach(tag => {
//             sdata.push(tag);
//         });

//         snapshot.data().grade.forEach(tag => {
//             cdata.push(tag);
//         });

//         //data = JSON.stringify(data)
//         res.send({
//             subject: sdata,
//             grade: cdata
//         })
//     });
// })

// /**
//  * @api {post}
//  * @apiName views
 
//  *
//  * @apiParam {id} id Users unique ID.
//  *
//  * @apiSuccess {String} 
//  * 
//  */
// app.post('/views', (req, res) => {
//     user.db.collection('resources').doc(req.body.id).get().then((res) => {
//         let data = res.data()

//         data.views += 1

//         user.db.collection('resources').doc(req.body.id).set(data)
//     })

//     res.send({
//         result: 'Targeted resource has been viewed.'
//     })
// })

// /**
//  * @api {post}
//  * @apiName helpful
 
//  *
//  * @apiParam {id} 
//  * @apiParam {sid} 
//  *
//  * @apiSuccess {String} 
//  * 
//  */
// app.post('/helpful', (req, res) => {
//     user.db.collection('resources').doc(req.body.id).get().then((res) => {
//         let data = res.data()
//         let chk = false

//         if(data.responsers){
//             data.responsers.forEach(id => {
//                 if(id == req.body.sid){
//                     chk = true
//                 }
//             })
//         }else{
//             data.responsers = []
//         }

//         if(!chk)
//         {
//             data.helpful += 1
//             data.responsers.push(req.body.sid)
    
//             user.db.collection('resources').doc(req.body.id).set(data)
    
//             user.db.collection('users').doc(req.body.sid).get().then((res) => {
//                 let sdata = res.data()
//                 sdata.helpful ? sdata.helpful = [...sdata.helpful, req.body.id] : sdata.helpful = [req.body.id]
//                 user.db.collection('users').doc(req.body.sid).set(sdata)
//             })
//         }
//     })
    
//     res.send({
//         result: 'Targeted resource has been found helpful.'
//     })
// })

// /**
//  * @api {post}
//  * @apiName nothelpful
 
//  *
//  * @apiParam {id} 
//  * @apiParam {sid} 
//  *
//  * @apiSuccess {String} 
//  * 
//  */
// app.post('/nothelpful', (req, res) => {
//     user.db.collection('resources').doc(req.body.id).get().then((res) => {
//         let data = res.data()
//         let chk = false

//         if(data.responsers){
//             data.responsers.forEach(id => {
//                 if(id == req.body.sid){
//                     chk = true
//                 }
//             })
//         }else{
//             data.responsers = []
//         }

//         if(!chk)
//         {
//             data.nothelpful += 1
//             data.responsers.push(req.body.sid)

//             user.db.collection('resources').doc(req.body.id).set(data)

//             user.db.collection('users').doc(req.body.sid).get().then((res) => {
//                 let sdata = res.data()
//                 sdata.nothelpful ? sdata.nothelpful = [...sdata.nothelpful, req.body.id] : sdata.nothelpful = [req.body.id]
//                 user.db.collection('users').doc(req.body.sid).set(sdata)
//             })    
//         }
//     })

            
//     res.send({
//         result: 'Targeted resource has not been found helpful.'
//     })
// })

/**
 * @api {post}
 * @apiName signin
 
 * "teacher"
 * @apiParam {id} id Users unique ID.
 * 
 * "student"
 * @apiParam {id} id Users unique ID.
 * 
 * "parent"
 * @apiParam {id} id Users unique ID.
 *
 * @apiSuccess {String array} 
 * 
 */
app.post('/signin', async (req, res) => {
    if (req.body.type == 'teacher') {
        let data;
        try {
            data = await read.signinTeacher(req.body.nic, req.body.pwd)
        }
        catch (e) {
            console.log(e)
        }
        if ((data == undefined) || (data == 'Invalid nic or password')) {
            return res.send({
                result: 'Record not found'
            })
        }
        res.send({
            result: data
        })
    }
    else if (req.body.type === 'student') {
        let data;
        try {
            data = await read.signinStudent(req.body.nic, req.body.pwd)
            console.log('student data ==>', data)
        }
        catch (e) {
            console.log(e)
        }
        if ((data == undefined) || (data == 'Invalid nic or password')) {
            return res.status(404).send({ error: 'Record not found' })
        }
        res.send({
            result: data
        })
    }
    else if (req.body.type === 'parent') {
        let data;
        try {
            data = await read.signinParent(req.body.nic, req.body.pwd)
        }
        catch (e) {
            console.log(e)
        }
        if ((data == undefined) || (data == 'Invalid nic or password')) {
            return res.status(404).send({ error: 'Record not found' })
        }
        res.send({
            result: data
        })
    }
})

// /**
//  * @api {get}
//  * @apiName institutes
//  *
//  * @apiSuccess {String array} array of institutes
//  */
// app.get('/institutes', (req, res) => {
//     user.db.collection('institutes').get().then(snapshot => {
//         let data = []
//         snapshot.docs.forEach(doc => {
//             data.push(doc.data());
//         });

//         //data = JSON.stringify(data)
//         res.send({
//             resources: data
//         })
//     });
// })

// /**
//  * @api {post}
//  * @apiName inst_signup
 
//  * "parent"
//  * @apiParam {type} 
//  * @apiParam {name}
//  * @apiParam {nic} 
//  * @apiParam {address} 
//  * @apiParam {phone} 
//  * @apiParam {email} 
//  * @apiParam {date} 
//  * @apiParam {month} 
//  * @apiParam {year} 
//  * @apiParam {id} 
//  * @apiSuccess {JSON object} 
 
//  * "teacher"
//  * @apiParam {type} 
//  * @apiParam {name}
//  * @apiParam {nic} 
//  * @apiParam {address} 
//  * @apiParam {phone} 
//  * @apiParam {email} 
//  * @apiParam {date} 
//  * @apiParam {month} 
//  * @apiParam {year} 
//  * @apiParam {id} 
//  * @apiParam {qualification} 
//  * @apiSuccess {JSON object} 
 
//  * "student"
//  * @apiParam {type} 
//  * @apiParam {name}
//  * @apiParam {guardian_name} 
//  * @apiParam {guardian_phone} 
//  * @apiParam {phone} 
//  * @apiParam {address} 
//  * @apiParam {guardian_email} 
//  * @apiParam {guardian_nic} 
//  * @apiParam {date} 
//  * @apiParam {month} 
//  * @apiParam {year} 
//  * @apiParam {email} 
//  * @apiParam {id} 
//  * @apiSuccess {JSON object} 
//  */
// app.post('/inst_signup', (req, res) => {
//     if (req.body.type == 'parent') {
//         insert.inst_signupParent(req.body.institute_id, req.body.institute_name, req.body.type, req.body.name, req.body.nic, req.body.address, req.body.phone, req.body.email, req.body.date, req.body.month, req.body.year, req.body.id)
//         res.send({
//             result: req.body
//         })
//     }
//     if (req.body.type == 'teacher') {
//         insert.inst_signupTeacher(req.body.date_of_joining, req.body.institute_id, req.body.institute_name, req.body.type, req.body.name, req.body.nic, req.body.address, req.body.phone, req.body.email, req.body.date, req.body.month, req.body.year, req.body.id, req.body.qualification)
//         res.send({
//             result: req.body
//         })
//     }
//     if (req.body.type == 'student') {
//         insert.inst_signupStudent(req.body.student_nic, req.body.date_of_joining, req.body.institute_id, req.body.institute_name, req.body.type, req.body.name, req.body.guardian_name, req.body.guardian_phone, req.body.phone, req.body.address, req.body.guardian_email, req.body.guardian_nic, req.body.date, req.body.month, req.body.year, req.body.email, req.body.id)
//         res.send({
//             result: req.body
//         })
//     }
// })

// /**
//  * @api {get}
//  * @apiName inst_students
//  *
//  * @apiSuccess {String array} array of institute students
//  */
// app.get('/inst_students', (req, res) => {
//     user.db.collection('institute_students').get().then(snapshot => {
//         let data = []
//         snapshot.docs.forEach(doc => {
//             data.push(doc.data());
//         });

//         //data = JSON.stringify(data)
//         res.send({
//             resources: data
//         })
//     });
// })

// /**
//  * @api {get}
//  * @apiName inst_teachers
//  *
//  * @apiSuccess {String array} array of institute teachers
//  */
// app.get('/inst_teachers', (req, res) => {
//     user.db.collection('institute_teachers').get().then(snapshot => {
//         let data = []
//         snapshot.docs.forEach(doc => {
//             data.push(doc.data());
//         });

//         //data = JSON.stringify(data)
//         res.send({
//             resources: data
//         })
//     });
// })

// /**
//  * @api {post}
//  * @apiName update_inst_student
 
//  *
//  * @apiParam {id} 
//  * @apiParam {date_of_joining} 
//  * @apiParam {institute_id}
//  * @apiParam {institute_name} 
//  * @apiParam {type} 
//  * @apiParam {name} 
//  * @apiParam {guardian_name} 
//  * @apiParam {guardian_email} 
//  * @apiParam {guardian_phone} 
//  * @apiParam {phone} 
//  * @apiParam {address} 
//  * @apiParam {guardian_email} 
//  * @apiParam {student_nic} 
//  * @apiParam {guardian_nic} 
//  * @apiParam {date} 
//  * @apiParam {month} 
//  * @apiParam {year} 
//  * @apiParam {email} 
//  * @apiSuccess {String} 
//  * 
//  */
// app.post('/update_inst_student', (req, res) => {
//     user.db.collection('institute_students').doc(req.body.id).get().then((res) => {
//         let data = res.data()
//         console.log(data)
//         if (req.body.date_of_joining) {
//             data.date_of_joining = req.body.date_of_joining
//         }
//         if (req.body.institute_id) {
//             data.institute_id = req.body.institute_id
//         }
//         if (req.body.institute_name) {
//             data.institute_name = req.body.institute_name
//         }
//         if (req.body.type) {
//             data.type = req.body.type
//         }
//         if (req.body.name) {
//             data.name = req.body.name
//         }
//         if (req.body.guardian_name) {
//             data.guardian_name = req.body.guardian_name
//         }
//         else if (req.body.guardian_phone) {
//             data.guardian_phone = req.body.guardian_phone
//         }
//         if (req.body.phone) {
//             data.phone = req.body.phone
//         }
//         if (req.body.address) {
//             data.address = req.body.address
//         }
//         if (req.body.guardian_email) {
//             data.guardian_email = req.body.guardian_email
//         }
//         if (req.body.student_nic) {
//             data.student_nic = req.body.student_nic
//         }
//         if (req.body.guardian_nic) {
//             data.guardian_nic = req.body.guardian_nic
//         }
//         if (req.body.date) {
//             data.date = req.body.date
//         }
//         if (req.body.month) {
//             data.month = req.body.month
//         }
//         if (req.body.year) {
//             data.year = req.body.year
//         }
//         if (req.body.email) {
//             data.email = req.body.email
//         }

//         user.db.collection('institute_students').doc(req.body.id).set(data)
//     })

//     res.send({
//         result: 'Targeted institute student has been Updated.'
//     })
// })

// /**
//  * @api {post}
//  * @apiName update_inst_teacher
 
//  *
//  * @apiParam {id} 
//  * @apiParam {date_of_joining} 
//  * @apiParam {institute_id} 
//  * @apiParam {institute_name} 
//  * @apiParam {type} 
//  * @apiParam {name} 
//  * @apiParam {nic} 
//  * @apiParam {address} 
//  * @apiParam {phone} 
//  * @apiParam {email} 
//  * @apiParam {date} 
//  * @apiParam {month} 
//  * @apiParam {year} 
//  * @apiParam {resources} 
//  * @apiParam {qualification} 
//  *
//  * @apiSuccess {String array} array of announcements 
//  * 
//  */
// app.post('/update_inst_teacher', (req, res) => {
//     user.db.collection('institute_teachers').doc(req.body.id).get().then((res) => {
//         let data = res.data()
//         console.log(data)
//         if (req.body.date_of_joining) {
//             data.date_of_joining = req.body.date_of_joining
//         }
//         if (req.body.institute_id) {
//             data.institute_id = req.body.institute_id
//         }
//         if (req.body.institute_name) {
//             data.institute_name = req.body.institute_name
//         }
//         if (req.body.type) {
//             data.type = req.body.type
//         }
//         if (req.body.name) {
//             data.name = req.body.name
//         }
//         if (req.body.nic) {
//             data.nic = req.body.nic
//         }
//         else if (req.body.address) {
//             data.address = req.body.address
//         }
//         if (req.body.phone) {
//             data.phone = req.body.phone
//         }
//         if (req.body.email) {
//             data.email = req.body.email
//         }
//         if (req.body.date) {
//             data.date = req.body.date
//         }
//         if (req.body.month) {
//             data.month = req.body.month
//         }
//         if (req.body.year) {
//             data.year = req.body.year
//         }
//         if (req.body.resources) {
//             data.resources = req.body.resources
//         }
//         if (req.body.qualification) {
//             data.qualification = req.body.qualification
//         }

//         user.db.collection('institute_teachers').doc(req.body.id).set(data)
//     })

//     res.send({
//         result: 'Targeted institute teacher has been Updated.'
//     })
// })

// /**
//  * @api {post}
//  * @apiName remove_inst_student
 
//  *
//  * @apiParam {id} id Users unique ID.
//  *
//  * @apiSuccess {String} 
//  * 
//  */
// app.post('/remove_inst_student', (req, res) => {
//     user.db.collection('institute_students').doc(req.body.id).get().then((res) => {
//         let data = res.data()

//         data.is_archive = true

//         user.db.collection('institute_students').doc(req.body.id).set(data)
//     })

//     res.send({
//         result: 'Targeted student has been deleted.'
//     })
// })

// /**
//  * @api {post}
//  * @apiName remove_inst_teacher
 
//  *
//  * @apiParam {id} id Users unique ID.
//  *
//  * @apiSuccess {String} 
//  * 
//  */
// app.post('/remove_inst_teacher', (req, res) => {
//     user.db.collection('institute_teachers').doc(req.body.id).get().then((res) => {
//         let data = res.data()

//         data.is_archive = true

//         user.db.collection('institute_teachers').doc(req.body.id).set(data)
//     })

//     res.send({
//         result: 'Targeted teacher has been deleted.'
//     })
// })

/**
 * @api {get}
 * @apiName *
 * @apiSuccess {String} error message
 */
app.get('*', (req, res) => {
    console.log('route not found')
    res.status(404).send({
        title: '404',
        name: 'Bilal Khan',
        error: 'Page not found.'
    })
})

module.exports = app;