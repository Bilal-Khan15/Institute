const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const db = require('../models/user.js')
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
    if (req.body.type == 'Parents') {
        if((req.body.type.trim() == '')
            || (req.body.Name.trim() == '') || (!validator.isLength(req.body.Name, min= 2, max= undefined))
            || (req.body.NIC.trim() == '') || (!validator.isLength(req.body.NIC, min= 13, max= 16)) || (!validator.isNumeric(req.body.NIC))
            || (req.body.Address.trim() == '') || (!validator.isLength(req.body.Address, min= 5, max= 95)) 
            || (req.body.Phone.trim() == '') || (!validator.isNumeric(req.body.Phone)) || (!validator.isLength(req.body.Phone, min= 10, max= 15)) 
            || (req.body.Email.trim() == '') || (!validator.isEmail(req.body.Email)) || (!validator.isLength(req.body.Email, min= 5, max= 320))
            || (req.body.Date.trim() == '') || (req.body.Month.trim() == '') || (req.body.Year.trim() == '') )
        {
            return res.send({
                result: 'Please fill all the fields properly !'
            })
        }
        insert.signupParent(req.body.type, req.body.Name, req.body.NIC, req.body.Address, req.body.Phone, req.body.Email, req.body.Date, req.body.Month, req.body.Year, req.body.Uid)
        res.send({
            result: req.body.Name + ' has been Addressed as ' + req.body.type
        })
    }
    if (req.body.type == 'Teachers') {
        if((req.body.type.trim() == '') 
            || (req.body.Name.trim() == '') || (!validator.isLength(req.body.Name, min= 2, max= undefined)) 
            || (req.body.NIC.trim() == '') || (!validator.isLength(req.body.NIC, min= 13, max= 16)) || (!validator.isNumeric(req.body.NIC)) 
            || (req.body.Address.trim() == '') || (!validator.isLength(req.body.Address, min= 5, max= 95)) 
            || (req.body.Phone.trim() == '') || (!validator.isNumeric(req.body.Phone)) || (!validator.isLength(req.body.Phone, min= 10, max= 15)) 
            || (req.body.Email.trim() == '') || (!validator.isEmail(req.body.Email))  || (!validator.isLength(req.body.Email, min= 5, max= 320))
            || (req.body.Date.trim() == '') || (req.body.Month.trim() == '') || (req.body.Year.trim() == '') 
            || (req.body.Uid.trim() == ''))
        {
            return res.send({
                result: 'Please fill all the fields properly !'
            })
        }
        insert.signupTeacher(req.body.type, req.body.Name, req.body.NIC, req.body.Address, req.body.Phone, req.body.Email, req.body.Date, req.body.Month, req.body.Year, req.body.Uid)
        res.send({
            result: req.body.Name + ' has been Addressed as ' + req.body.type
        })
    }
    if (req.body.type == 'Students') {
        if((req.body.type.trim() == '') 
            || (req.body.Name.trim() == '') || (!validator.isLength(req.body.Name, min= 2, max= undefined))
            || (req.body.GuardianName.trim() == '') || (!validator.isLength(req.body.GuardianName, min= 2, max= undefined)) 
            || (req.body.GuardianPhone.trim() == '') || (!validator.isNumeric(req.body.GuardianPhone)) || (!validator.isLength(req.body.GuardianPhone, min= 10, max= 15)) 
            || (req.body.StudentPhone.trim() == '') || (!validator.isNumeric(req.body.StudentPhone)) 
            || (req.body.School.trim() == '') 
            || (req.body.Address.trim() == '') || (!validator.isLength(req.body.Address, min= 5, max= 95)) 
            || (req.body.GuardianEmail.trim() == '') || (!validator.isEmail(req.body.GuardianEmail)) || (!validator.isLength(req.body.GuardianEmail, min= 5, max= 320)) 
            || (req.body.GuardianNIC.trim() == '') || (!validator.isLength(req.body.GuardianNIC, min= 13, max= 16)) || (!validator.isNumeric(req.body.GuardianNIC))
            || (req.body.Date.trim() == '') || (req.body.Month.trim() == '') || (req.body.Year.trim() == '') 
            || (req.body.StudentEmail.trim() == '') || (!validator.isEmail(req.body.StudentEmail)) || (!validator.isLength(req.body.StudentEmail, min= 5, max= 320)))
        {
            return res.send({
                result: 'Please fill all the fields properly !'
            })
        }
        insert.signupStudent(req.body.type, req.body.Name, req.body.GuardianName, req.body.GuardianPhone, req.body.StudentPhone, req.body.School, req.body.Address, req.body.GuardianEmail, req.body.GuardianNIC, req.body.Date, req.body.Month, req.body.Year, req.body.StudentEmail, req.body.Uid)
        res.send({
            result: req.body.Name + ' has been Addressed as ' + req.body.type
        })
    }
})

app.post('/addResource', (req, res) => {
    if((req.body.Title.trim() == '') || (!validator.isLength(req.body.Title, min= 1, max= 60))  
        || (req.body.Description.trim() == '') || (!validator.isLength(req.body.Description, min= 4, max= 160)) 
        || (req.body.Class.trim() == '') 
        || (req.body.Subject.trim() == '') 
        || (req.body.TeacherId.trim() == '') 
        || (req.body.Name.trim() == '') || (!validator.isLength(req.body.Name, min= 2, max= undefined)) 
        || (!validator.isURL(req.body.video_url)))
    {
        return res.send({
            result: 'Please fill all the fields properly !'
        })
    }

    insert.addResource(req.body.Title,req.body.Description, req.body.Class, req.body.Subject ,req.body.TeacherId, req.body.Name, req.body.file, req.body.video_url )

    res.send({
        result: req.body.Title + ' has been added.'
    })
})

app.post('/removeResource', (req, res) => {
    db.collection('Resources').doc(req.body.uid).get().then((res) => {
        let data = res.data()            

        data.isArchive = true

        db.collection('Resources').doc(req.body.uid).set(data)
    })

    res.send({
        result: 'Targeted resource has been deleted.'
    })
})

app.post('/updateResource', (req, res) => {
    db.collection('Resources').doc(req.body.uid).get().then((res) => {
        let data = res.data()            
        console.log(data)
        if(req.body.Title)
            {
                data.Title = req.body.Title
            }
        if(req.body.Description)
        {
            data.Description = req.body.Description
        }
        if(req.body.Grade)
        {
            data.Grade = req.body.Grade
        }
        if(req.body.Subject)
        {
            data.Subject = req.body.Subject
        }
        if(req.body.TeacherId)
        {
            data.TeacherId = req.body.TeacherId
        }
        if(req.body.Name)
        {
            data.Name = req.body.Name
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
        if(req.body.isArchive)
        {
            data.isArchive = req.body.isArchive
        }
        if(req.body.video_url)
        {
            data.video_url = req.body.video_url
        }

        db.collection('Resources').doc(req.body.uid).set(data)
    })

    res.send({
        result: 'Targeted resource has been Updated.'
    })
})

app.get('/library', (req, res) => {
    db.collection('Resources').get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            if(!doc.data().isArchive){
                data.push(doc.data());
            }
        });

        //data = JSON.stringify(data)
        res.send({
            Resources: data
        })
    });
})

app.get('/library/subject', (req, res) => {
    db.collection('Resources').where('Subject', '==', req.query.Subject).get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            if(!doc.data().isArchive){
                data.push(doc.data());
            }
        });

        //data = JSON.stringify(data)
        res.send({
            Resources: data
        })
    });
})

app.get('/library/class', (req, res) => {
    db.collection('Resources').where('Grade', '==', req.query.Class).get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            if(!doc.data().isArchive){
                data.push(doc.data());
            }
        });

        //data = JSON.stringify(data)
        res.send({
            Resources: data
        })
    });
})

app.get('/library/myLibrary', (req, res) => {
    db.collection('Resources').where('TeacherId', '==', req.query.id).get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            if(!doc.data().isArchive){
                data.push(doc.data());
            }
        });

        //data = JSON.stringify(data)
        res.send({
            Resources: data
        })
    });
})

app.get('/library/myLibrary/subject', (req, res) => {
    db.collection('Resources').where('Subject', '==', req.query.Subject).where('TeacherId', '==', req.query.id).get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            if(!doc.data().isArchive){
                data.push(doc.data());
            }
        });

        //data = JSON.stringify(data)
        res.send({
            Resources: data
        })
    });
})

app.get('/library/myLibrary/class', (req, res) => {
    db.collection('Resources').where('Grade', '==', req.query.Class).where('TeacherId', '==', req.query.id).get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            if(!doc.data().isArchive){
                data.push(doc.data());
            }
        });

        //data = JSON.stringify(data)
        res.send({
            Resources: data
        })
    });
})

app.post('/signin', async (req,res) => {
    console.log('body ===>',req.body)
    console.log('type ===>', req.body.type)
    if (req.body.type == 'Teachers') {
        let data;
        try {
            data = await signinTeacher(req.body.uid)
        }
        catch (e) {
            console.log(e)
        }
        res.send({
            result: data
        })
    }
    else if (req.body.type === 'Students') {
        let data;
        try {
            data = await signinStudent(req.body.uid)
            console.log('student data ==>',data)
        }
        catch (e) {
            console.log(e)
        }
        res.send({
            result: data
        })
    }
    else if (req.body.type === 'Parents') {
        let data;
        try {
            data = await signinParent(req.body.uid)
        }
        catch (e) {
            console.log(e)
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
        Name: 'Bilal Khan',
        errorMessage: 'Page not found.'
    })
})
   
module.exports = app;