const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const user = require('../models/user.js')
var validator = require('validator');

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())   

let router = express.Router(),
   constants = require('../utils/constant'),
   insert = require('../db-functions/insert'),
   db_delete = require('../db-functions/delete'),
   read = require('../db-functions/read'),
   update = require('../db-functions/update'),
   utilsFunction = require('../utils/functions');

app.post('/signup', (req, res) => {
    if (req.body.type == 'parent') {
        if((req.body.type.trim() == '')
            || (req.body.name.trim() == '') || (!validator.isLength(req.body.name, min= 2, max= undefined))
            || (req.body.nic.trim() == '') || (!validator.isLength(req.body.nic, min= 13, max= 16)) || (!validator.isNumeric(req.body.nic))
            || (req.body.address.trim() == '') || (!validator.isLength(req.body.address, min= 5, max= 95)) 
            || (req.body.phone.trim() == '') || (!validator.isNumeric(req.body.phone)) || (!validator.isLength(req.body.phone, min= 10, max= 15)) 
            || (req.body.email.trim() == '') || (!validator.isEmail(req.body.email)) || (!validator.isLength(req.body.email, min= 5, max= 320))
            || (req.body.date.trim() == '') || (req.body.month.trim() == '') || (req.body.year.trim() == '') )
        {
            return res.send({
                result: 'Please fill all the fields properly !'
            })
        }
        insert.signupParent(req.body.type, req.body.name, req.body.nic, req.body.address, req.body.phone, req.body.email, req.body.date, req.body.month, req.body.year, req.body.id)
        res.send({
            result: req.body.name + ' has been addressed as ' + req.body.type
        })
    }
    if (req.body.type == 'teacher') {
        if((req.body.type.trim() == '') 
            || (req.body.name.trim() == '') || (!validator.isLength(req.body.name, min= 2, max= undefined)) 
            || (req.body.nic.trim() == '') || (!validator.isLength(req.body.nic, min= 13, max= 16)) || (!validator.isNumeric(req.body.nic)) 
            || (req.body.address.trim() == '') || (!validator.isLength(req.body.address, min= 5, max= 95)) 
            || (req.body.phone.trim() == '') || (!validator.isNumeric(req.body.phone)) || (!validator.isLength(req.body.phone, min= 10, max= 15)) 
            || (req.body.email.trim() == '') || (!validator.isEmail(req.body.email))  || (!validator.isLength(req.body.email, min= 5, max= 320))
            || (req.body.qualification.trim() == '')|| (req.body.date.trim() == '') || (req.body.month.trim() == '') || (req.body.year.trim() == ''))
        {
            return res.send({
                result: 'Please fill all the fields properly !'
            })
        }
        insert.signupTeacher(req.body.type, req.body.name, req.body.nic, req.body.address, req.body.phone, req.body.email, req.body.date, req.body.month, req.body.year, req.body.id, req.body.qualification)
        res.send({
            result: req.body.name + ' has been addressed as ' + req.body.type
        })
    }
    if (req.body.type == 'student') {
        if((req.body.type.trim() == '') 
            || (req.body.name.trim() == '') || (!validator.isLength(req.body.name, min= 2, max= undefined))
            || (req.body.guardian_name.trim() == '') || (!validator.isLength(req.body.guardian_name, min= 2, max= undefined)) 
            || (req.body.guardian_phone.trim() == '') || (!validator.isNumeric(req.body.guardian_phone)) || (!validator.isLength(req.body.guardian_phone, min= 10, max= 15)) 
            || (req.body.student_phone.trim() == '') || (!validator.isNumeric(req.body.student_phone)) 
            || (req.body.school.trim() == '') 
            || (req.body.address.trim() == '') || (!validator.isLength(req.body.address, min= 5, max= 95)) 
            || (req.body.guardian_email.trim() == '') || (!validator.isEmail(req.body.guardian_email)) || (!validator.isLength(req.body.guardian_email, min= 5, max= 320)) 
            || (req.body.guardian_nic.trim() == '') || (!validator.isLength(req.body.guardian_nic, min= 13, max= 16)) || (!validator.isNumeric(req.body.guardian_nic))
            || (req.body.date.trim() == '') || (req.body.month.trim() == '') || (req.body.year.trim() == '') 
            || (req.body.student_email.trim() == '') || (!validator.isEmail(req.body.student_email)) || (!validator.isLength(req.body.student_email, min= 5, max= 320)))
        {
            return res.send({
                result: 'Please fill all the fields properly !'
            })
        }
        insert.signupStudent(req.body.type, req.body.name, req.body.guardian_name, req.body.guardian_phone, req.body.student_phone, req.body.school, req.body.address, req.body.guardian_email, req.body.guardian_nic, req.body.date, req.body.month, req.body.year, req.body.student_email, req.body.id)
        res.send({
            result: req.body.name + ' has been addressed as ' + req.body.type
        })
    }
})

app.post('/addResource', async (req, res) => {
    if((req.body.title.trim() == '') || (!validator.isLength(req.body.title, min= 1, max= 60))  
        || (req.body.description.trim() == '') || (!validator.isLength(req.body.description, min= 4, max= 160)) 
        || (req.body.grade.trim() == '') 
        || (req.body.subject.trim() == '') 
        || (req.body.teacher_id.trim() == '') 
        || (req.body.author.trim() == '') || (!validator.isLength(req.body.author, min= 2, max= undefined)))
    {
        return res.send({
            result: 'Please fill all the fields properly !'
        })
    }

    ret = await insert.addResource(req.body.title,req.body.description, req.body.grade, req.body.subject ,req.body.teacher_id, req.body.author, req.body.file, req.body.video_url, req.body.tags )

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
        if(req.body.title)
        {
            data.title = req.body.title
        }
        if(req.body.description)
        {
            data.description = req.body.description
        }
        if(req.body.grade)
        {
            data.grade = req.body.grade
        }
        if(req.body.subject)
        {
            data.subject = req.body.subject
        }
        if(req.body.teacher_id)
        {
            data.teacher_id = req.body.teacher_id
        }
        if(req.body.file)
        {
            data.file = req.body.file
        }
        if(req.body.author)
        {
            data.author = req.body.author
        }
        if(req.body.time)
        {
            data.time = req.body.time
        }
        if(req.body.is_archive)
        {
            data.is_archive = req.body.is_archive
        }
        if(req.body.video_url)
        {
            data.video_url = req.body.video_url
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
            if(!doc.data().is_archive){
                data.push(doc.data());
            }
        });

        //data = JSON.stringify(data)
        res.send({
            resources: data
        })
    });
})

app.get('/library/filter', (req, res) => {
    var path = ''
    if((req.query.grade) && (req.query.subject)){
        path = user.db.collection('resources').where('grade', '==', req.query.grade).where('subject', '==', req.query.subject)
    }else if((req.query.grade) && (!req.query.subject)){
        path = user.db.collection('resources').where('grade', '==', req.query.grade)
    }else if((!req.query.grade) && (req.query.subject)){
        path = user.db.collection('resources').where('subject', '==', req.query.subject)
    }

    path.get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            if(!doc.data().is_archive){
                data.push(doc.data());
            }
        });

        //data = JSON.stringify(data)
        res.send({
            resources: data
        })
    });
})

app.get('/library/myLibrary', (req, res) => {
    user.db.collection('resources').where('teacher_id', '==', req.query.id).get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            if(!doc.data().is_archive){
                data.push(doc.data());
            }
        });

        //data = JSON.stringify(data)
        res.send({
            resources: data
        })
    });
})

app.get('/library/myLibrary/filter', (req, res) => {
    var path = ''
    if((req.query.grade) && (req.query.subject)){
        path = user.db.collection('resources').where('grade', '==', req.query.grade).where('subject', '==', req.query.subject)
    }else if((req.query.grade) && (!req.query.subject)){
        path = user.db.collection('resources').where('grade', '==', req.query.grade)
    }else if((!req.query.grade) && (req.query.subject)){
        path = user.db.collection('resources').where('subject', '==', req.query.subject)
    }

    path.where('teacher_id', '==', req.query.id).get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            if(!doc.data().is_archive){
                data.push(doc.data());
            }
        });

        //data = JSON.stringify(data)
        res.send({
            resources: data
        })
    });
})

app.post('/addtag', (req, res) => {
    if((req.body.subject.trim() == '') && (req.body.grade.trim() == ''))
    {
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

app.post('/signin', async (req,res) => {
    if (req.body.type == 'teacher') {
        let data;
        try {
            data = await read.signinTeacher(req.body.id)
        }
        catch (e) {
            console.log(e)
        }
        if(data == undefined){
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
            console.log('student data ==>',data)
        }
        catch (e) {
            console.log(e)
        }
        if(data == undefined){
            return res.send({
                result: 'Record not found'
            })
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
        if(data == undefined){
            return res.send({
                result: 'Record not found'
            })
        }
        res.send({
            result: data
        })
    }
})

app.get('*', (req, res) => {
    console.log('route not found')
    res.send({
        title: '404',
        name: 'Bilal Khan',
        errorMessage: 'Page not found.'
    })
})
   
module.exports = app;