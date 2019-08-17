const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const user = require('../models/user.js')
const fs = require('fs')
var validator = require('validator');
var multipart = require('connect-multiparty');

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())   
var multipartMiddleware = multipart();

let router = express.Router(),
    constants = require('../utils/constant'),
    insert = require('../db-functions/insert'),
    db_delete = require('../db-functions/delete'),
    read = require('../db-functions/read'),
    update = require('../db-functions/update'),
    utilsFunction = require('../utils/functions');

app.post('/signup', (req, res) => {
    if (req.body.type == 'parent') {
        if ((req.body.type.trim() == '')
            || (req.body.name.trim() == '') || (!validator.isLength(req.body.name, min = 2, max = undefined))
            || (req.body.nic.trim() == '') || (!validator.isLength(req.body.nic, min = 13, max = 16)) || (!validator.isNumeric(req.body.nic))
            || (req.body.address.trim() == '') || (!validator.isLength(req.body.address, min = 5, max = 95))
            || (req.body.phone.trim() == '') || (!validator.isNumeric(req.body.phone)) || (!validator.isLength(req.body.phone, min = 10, max = 15))
            || (req.body.email.trim() == '') || (!validator.isEmail(req.body.email)) || (!validator.isLength(req.body.email, min = 5, max = 320))
            || (req.body.date.trim() == '') || (req.body.month.trim() == '') || (req.body.year.trim() == '')) {
                return res.status(404).send({ error: 'Please fill all the fields properly !' })
            }
        insert.signupParent(req.body.type, req.body.name, req.body.nic, req.body.address, req.body.phone, req.body.email, req.body.date, req.body.month, req.body.year, req.body.id)
        res.send({
            result: req.body.name + ' has been addressed as ' + req.body.type
        })
    }
    if (req.body.type == 'teacher') {
        if ((req.body.type.trim() == '')
            || (req.body.name.trim() == '') || (!validator.isLength(req.body.name, min = 2, max = undefined))
            || (req.body.nic.trim() == '') || (!validator.isLength(req.body.nic, min = 13, max = 16)) || (!validator.isNumeric(req.body.nic))
            || (req.body.address.trim() == '') || (!validator.isLength(req.body.address, min = 5, max = 95))
            || (req.body.phone.trim() == '') || (!validator.isNumeric(req.body.phone)) || (!validator.isLength(req.body.phone, min = 10, max = 15))
            || (req.body.email.trim() == '') || (!validator.isEmail(req.body.email)) || (!validator.isLength(req.body.email, min = 5, max = 320))
            || (req.body.qualification.trim() == '') || (req.body.date.trim() == '') || (req.body.month.trim() == '') || (req.body.year.trim() == '')) {
                return res.status(404).send({ error: 'Please fill all the fields properly !' })
            }
        insert.signupTeacher(req.body.type, req.body.name, req.body.nic, req.body.address, req.body.phone, req.body.email, req.body.date, req.body.month, req.body.year, req.body.id, req.body.qualification)
        res.send({
            result: req.body.name + ' has been addressed as ' + req.body.type
        })
    }
    if (req.body.type == 'student') {
        if ((req.body.type.trim() == '')
            || (req.body.name.trim() == '') || (!validator.isLength(req.body.name, min = 2, max = undefined))
            || (req.body.guardian_name.trim() == '') || (!validator.isLength(req.body.guardian_name, min = 2, max = undefined))
            || (req.body.guardian_phone.trim() == '') || (!validator.isNumeric(req.body.guardian_phone)) || (!validator.isLength(req.body.guardian_phone, min = 10, max = 15))
            || (req.body.student_phone.trim() == '') || (!validator.isNumeric(req.body.student_phone))
            || (req.body.school.trim() == '')
            || (req.body.address.trim() == '') || (!validator.isLength(req.body.address, min = 5, max = 95))
            || (req.body.guardian_email.trim() == '') || (!validator.isEmail(req.body.guardian_email)) || (!validator.isLength(req.body.guardian_email, min = 5, max = 320))
            || (req.body.guardian_nic.trim() == '') || (!validator.isLength(req.body.guardian_nic, min = 13, max = 16)) || (!validator.isNumeric(req.body.guardian_nic))
            || (req.body.date.trim() == '') || (req.body.month.trim() == '') || (req.body.year.trim() == '')
            || (req.body.student_email.trim() == '') || (!validator.isEmail(req.body.student_email)) || (!validator.isLength(req.body.student_email, min = 5, max = 320))) {
            return res.status(404).send({ error: 'Please fill all the fields properly !' })
        }
        insert.signupStudent(req.body.type, req.body.name, req.body.guardian_name, req.body.guardian_phone, req.body.student_phone, req.body.school, req.body.address, req.body.guardian_email, req.body.guardian_nic, req.body.date, req.body.month, req.body.year, req.body.student_email, req.body.id)
        res.send({
            result: req.body.name + ' has been addressed as ' + req.body.type
        })
    }
})

app.post('/addAnnouncement', async (req, res) => {
    if((req.body.type.trim() == '') 
        || (req.body.teacher_id.trim() == '') 
        || (req.body.title.trim() == '') || (!validator.isLength(req.body.title, min= 1, max= 60))  
        || (req.body.marks == undefined) 
        || (req.body.description.trim() == '') || (!validator.isLength(req.body.description, min= 0, max= 1000)) 
        || (req.body.grade_id.trim() == '') || (req.body.section_id.trim() == '') || (req.body.subject_id.trim() == '')  
        || (req.body.subject.trim() == '') 
        || (req.body.section == []) 
        || (req.body.grade == [])){
            return res.status(404).send({ error: 'Please fill all the fields properly !' })
        }

    ret = await insert.addAnnouncement(req.body.grade_id, req.body.section_id, req.body.subject_id, req.body.type, req.body.teacher_id, req.body.title, req.body.marks, req.body.description, req.body.attachment, req.body.suggestion, req.body.subject, req.body.section, req.body.grade)

    req.body.time = ret[0]
    req.body.id = ret[1]
    req.body.student_id = ret[2]

    res.send({
        result: req.body
    })
})

app.get('/announcements', (req, res) => {
    user.db.collection('announcements').get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            data.push(doc.data());
        });

        //data = JSON.stringify(data)
        res.send({
            resources: data
        })
    });
})


app.get('/myAnnouncements', (req, res) => {
    let data = []
    user.db.collection('announcements').where('student_id', 'array-contains', req.query.id).get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            data.push(doc.data())
        })

        res.send({
            resources: data
        })
    });
})










const addingclass = (snapshot, test) => new Promise((resolve, reject) => {
    test = []
    snapshot.docs.forEach(doc => {
        test.push(doc.data())
    })
    resolve(test)
})

app.get('/json', async (req, res) => {
    var grade = []
    var sec = []
    var subj = []
    await user.db.collection('grades').get().then(async (classes) => {
        grade = await addingclass(classes, grade)
    })

    await user.db.collection('sections').get().then(async (sections) => {
        sec = await addingclass(sections, sec)
    })

    await user.db.collection('subjects').get().then(async (subjs) => {
        subj = await addingclass(subjs, subj)
    })

    await sec.map(g => {
        var subjects_list = g.subjects
        g.subjects = []
        subj.map(s => {
            subjects_list.map(temp => {
                if(temp == s.id)
                {
                    return g.subjects.push(s)
                }
            })
        })
    })

    await grade.map(g => {
        var sections_list = g.sections
        g.sections = []
        sec.map(s => {
            sections_list.map(temp => {
                if(temp == s.id)
                {
                    return g.sections.push(s)
                }
            })
        })
    })

    // grade = await JSON.stringify(grade)
    res.send(grade)
})









// app.get('/broadcastAnnouncement', (req, res) => {
//     var data = [];
        
//     user.db.collection('announcement_details').doc(req.query.id).get().then(snapshot => {
//         snapshot.data().grade.forEach(g => {
//             snapshot.data().section.forEach(s => {
//                 user.db.collection('grades').where('grade', '==', g).where('section', '==', s).where('subject', '==', snapshot.data().subject).get().then(doc => {
//                     if(doc.docs){
//                         data.push(doc.docs[0].data().grade) 
//                         console.log(doc.docs[0].data().grade) 
//                     }
//                 }).catch(err => console.log('error'));
//             })
//         })

//         console.log(data)
//         // data = JSON.stringify(data)
//         res.send({
//             resources: data
//         })
//     })
// })

















app.get('/broadcastAnnouncement', (req, res) => {
    let gdata = []
    let sdata = []
    let data = []
    await user.db.collection('announcements').doc(req.query.id).get().then(snapshot => {
        gdata = snapshot.data().grade_id        
        sdata = snapshot.data().section_id        
    })

    // await gdata.map(s => {
    //     user.db.collection('grades').doc(s).get().then(snapshot => {
    //         return data.push(snapshot.data())
    //     })    
    // })

    await sdata.map(s => {
        user.db.collection('sections').doc(s).get().then(snapshot => {
            return data.push(snapshot.data())
        })    
    })

    res.send({
        resources: data
    })
})








app.get('/pAnnouncements', async (req, res) => {
    let sdata = []
    let data = []
    await user.db.collection('users').doc(req.query.id).get().then(snapshot => {
        sdata = snapshot.data().student_id        
    })

    await sdata.map(s => {
        user.db.collection('announcements').where('student_id', 'array-contains', s).get().then(snapshot => {
            snapshot.docs.forEach(doc => {  // try "map" instead of "forEach"
                return data.push(doc.data())
            })
        })    
    })

    res.send({
        resources: data
    })
})








app.post('/addResource', async (req, res) => {
    if((req.body.title.trim() == '') || (!validator.isLength(req.body.title, min= 1, max= 60))  
        || (req.body.description.trim() == '') || (!validator.isLength(req.body.description, min= 0, max= 1000)) 
        || (req.body.grade.trim() == '') 
        || (req.body.subject.trim() == '') 
        || (req.body.teacher_id.trim() == '') 
        || (req.body.author.trim() == '') || (!validator.isLength(req.body.author, min= 2, max= undefined))){
            return res.status(404).send({ error: 'Please fill all the fields properly !' })
        }

    // ret = await insert.addResource(req.body.title, req.body.description, req.body.grade, req.body.subject, req.body.teacher_id, req.body.author, req.body.file, req.body.video_url, req.body.tags)

    // req.body.time = ret[0]
    // req.body.is_archive = ret[1]
    // req.body.id = ret[2]

    console.log('backend')
    const dataBuffer = fs.readFileSync(req.body.file, function (err, data) {
        //console.log('data ==> ' + data)
    })
    // const dataJSON = dataBuffer.toString()
    // const notes = JSON.parse(dataJSON)
    // console.log(notes)
    console.log('buffer ==> ' + dataBuffer)


    req.body.time = ret[0]
    req.body.is_archive = ret[1]
    req.body.id = ret[2]

    res.send({
        result: req.body
    })
})

app.post('/removeResource', (req, res) => {
    user.db.collection('resources').doc(req.body.id).get().then((res) => {
        let data = res.data()

        data.is_archive = true

        user.db.collection('resources').doc(req.body.id).set(data)
    })

    res.send({
        result: 'Targeted resource has been deleted.'
    })
})

app.post('/updateResource', (req, res) => {
    user.db.collection('resources').doc(req.body.id).get().then((res) => {
        let data = res.data()
        console.log(data)
        if (req.body.title) {
            data.title = req.body.title
        }
        if (req.body.description) {
            data.description = req.body.description
        }
        if (req.body.grade) {
            data.grade = req.body.grade
        }
        if (req.body.subject) {
            data.subject = req.body.subject
        }
        if (req.body.teacher_id) {
            data.teacher_id = req.body.teacher_id
        }
        if (req.body.file) {
            data.file = req.body.file
            data.video_url = ''
        }
        else if (req.body.video_url) {
            data.video_url = req.body.video_url
            data.file = ''
        }
        if (req.body.author) {
            data.author = req.body.author
        }
        if (req.body.time) {
            data.time = req.body.time
        }
        if (req.body.is_archive) {
            data.is_archive = req.body.is_archive
        }

        user.db.collection('resources').doc(req.body.id).set(data)
    })

    res.send({
        result: 'Targeted resource has been Updated.'
    })
})

app.get('/library', (req, res) => {
    user.db.collection('resources').get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            if (!doc.data().is_archive) {
                data.push(doc.data());
            }
        });

        //data = JSON.stringify(data)
        res.send({
            resources: data
        })
    });
})

function getdate(day)
{
    if(day == 'yesterday') { diffDays = 1 } 
    else if(day == 'last_week') { diffDays = 7 } 
    else if(day == 'last_month') { diffDays = 31 } 
    else if(day == 'most_recent') { return 0 }

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    currentTime = mm + '/' + dd + '/' + yyyy;
    const date2 = new Date(currentTime);

    const diffTime = diffDays * (1000 * 60 * 60 * 24);
    date1 = Math.abs(date2.getTime() - diffTime)
    return date1 
}

app.post('/library/filter', (req, res) => {
    var time = getdate(req.body.time)
    user.db.collection('resources').where('time', '>=', time).get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            let chk = false
            req.body.subject.forEach(sub => {
                if ((!doc.data().is_archive) && (doc.data().subject == sub.label)) {
                    data.push(doc.data())
                    chk = true
                }
            });

            req.body.grade.forEach(sub => {
                if ((!doc.data().is_archive) && (doc.data().grade == sub.label) && (!chk)) {
                    data.push(doc.data())
                    chk = true
                }
            });
        });
        res.send({
            resources: data
        })
    });
})

app.get('/library/myLibrary', (req, res) => {
    user.db.collection('resources').where('teacher_id', '==', req.query.id).get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            if (!doc.data().is_archive) {
                data.push(doc.data());
            }
        });

        //data = JSON.stringify(data)
        res.send({
            resources: data
        })
    });
})

app.post('/library/myLibrary/filter', (req, res) => {
    var time = getdate(req.body.time)
    user.db.collection('resources').where('teacher_id', '==', req.body.id).where('time', '>=', time).get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            let chk = false
            req.body.subject.forEach(sub => {
                if((!doc.data().is_archive) && (doc.data().subject == sub.label))
                {
                    data.push(doc.data())
                    chk = true
                }
            });

            req.body.grade.forEach(sub => {
                if((!doc.data().is_archive) && (doc.data().grade == sub.label) && (!chk))
                {
                    data.push(doc.data())
                    chk = true
                }
            });
        });
        res.send({
                resources: data
        })
    });
})

app.post('/addtag', (req, res) => {
    if ((req.body.subject.trim() == '') && (req.body.grade.trim() == '')) {
        return res.send({
            result: 'Please fill all the fields properly !'
        })
    }

    insert.addtag(req.body.subject, req.body.grade)

    res.send({
        result: 'Tag has been added.'
    })
})

app.get('/tags', (req, res) => {
    user.db.collection('tags').doc('resources').get().then(snapshot => {
        let sdata = []
        let cdata = []
        snapshot.data().subject.forEach(tag => {
            sdata.push(tag);
        });

        snapshot.data().grade.forEach(tag => {
            cdata.push(tag);
        });

        //data = JSON.stringify(data)
        res.send({
            subject: sdata,
            grade: cdata
        })
    });
})

app.post('/views', (req, res) => {
    user.db.collection('resources').doc(req.body.id).get().then((res) => {
        let data = res.data()

        data.views += 1

        user.db.collection('resources').doc(req.body.id).set(data)
    })

    res.send({
        result: 'Targeted resource has been viewed.'
    })
})

app.post('/helpful', (req, res) => {
    user.db.collection('resources').doc(req.body.id).get().then((res) => {
        let data = res.data()
        let chk = false

        if(data.responsers){
            data.responsers.forEach(id => {
                if(id == req.body.sid){
                    chk = true
                }
            })
        }else{
            data.responsers = []
        }

        if(!chk)
        {
            data.helpful += 1
            data.responsers.push(req.body.sid)
    
            user.db.collection('resources').doc(req.body.id).set(data)
    
            user.db.collection('users').doc(req.body.sid).get().then((res) => {
                let sdata = res.data()
                sdata.helpful ? sdata.helpful = [...sdata.helpful, req.body.id] : sdata.helpful = [req.body.id]
                user.db.collection('users').doc(req.body.sid).set(sdata)
            })
        }
    })
    
    res.send({
        result: 'Targeted resource has been found helpful.'
    })
})

app.post('/nothelpful', (req, res) => {
    user.db.collection('resources').doc(req.body.id).get().then((res) => {
        let data = res.data()
        let chk = false

        if(data.responsers){
            data.responsers.forEach(id => {
                if(id == req.body.sid){
                    chk = true
                }
            })
        }else{
            data.responsers = []
        }

        if(!chk)
        {
            data.nothelpful += 1
            data.responsers.push(req.body.sid)

            user.db.collection('resources').doc(req.body.id).set(data)

            user.db.collection('users').doc(req.body.sid).get().then((res) => {
                let sdata = res.data()
                sdata.nothelpful ? sdata.nothelpful = [...sdata.nothelpful, req.body.id] : sdata.nothelpful = [req.body.id]
                user.db.collection('users').doc(req.body.sid).set(sdata)
            })    
        }
    })

            
    res.send({
        result: 'Targeted resource has not been found helpful.'
    })
})

app.post('/signin', async (req, res) => {
    if (req.body.type == 'teacher') {
        let data;
        try {
            data = await read.signinTeacher(req.body.id)
        }
        catch (e) {
            console.log(e)
        }
        if (data == undefined) {
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
            data = await read.signinStudent(req.body.id)
            console.log('student data ==>', data)
        }
        catch (e) {
            console.log(e)
        }
        if (data == undefined) {
            return res.status(404).send({ error: 'Record not found' })
        }
        res.send({
            result: data
        })
    }
    else if (req.body.type === 'parent') {
        let data;
        try {
            data = await read.signinParent(req.body.id)
        }
        catch (e) {
            console.log(e)
        }
        if (data == undefined) {
            return res.status(404).send({ error: 'Record not found' })
        }
        res.send({
            result: data
        })
    }
})

app.get('*', (req, res) => {
    console.log('route not found')
    res.status(404).send({
        title: '404',
        name: 'Bilal Khan',
        error: 'Page not found.'
    })
})

module.exports = app;