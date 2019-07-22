const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const db = require('../models/user.js')

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
    console.log('body ===>',req.body)
    console.log('type ===>', req.body.type)
    if (req.body.type == 'Parents') {
        insert.signupParent(req.body.type, req.body.Name, req.body.NIC, req.body.Address, req.body.Phone, req.body.Email)
        res.send({
            result: req.body.Name + ' has been Addressed as ' + req.body.type
        })
    }
    if (req.body.type == 'Teachers') {
        insert.signupTeacher(req.body.type, req.body.Name, req.body.NIC, req.body.Address, req.body.Phone, req.body.Email, req.body.Date, req.body.Month, req.body.Year, req.body.Uid)
        res.send({
            result: req.body.Name + ' has been Addressed as ' + req.body.type
        })
    }
    if (req.body.type == 'Students') {
        insert.signupStudent(req.body.type, req.body.Name, req.body.GuardianName, req.body.GuardianPhone, req.body.StudentPhone, req.body.School, req.body.Address, req.body.GuardianEmail, req.body.GuardianNIC, req.body.Date, req.body.Month, req.body.Year, req.body.StudentEmail)
        res.send({
            result: req.body.Name + ' has been Addressed as ' + req.body.type
        })
    }
})

app.post('/addResource', (req, res) => {
    insert.addResource(req.body.Title,req.body.Description, req.body.Class, req.body.Subject ,req.body.TeacherId, req.body.Name, req.body.file, req.body.video_url )

    res.send({
        result: req.body.Title + ' has been added.'
    })
})

app.get('/library', (req, res) => {
    db.collection('Resources').get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            data.push(doc.data());
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
            data.push(doc.data());
        });

        //data = JSON.stringify(data)
        res.send({
            Resources: data
        })
    });
})

app.post('/signin', async (req,res) => {
    if (req.body.type == 'Teachers') {
        let data;
        try{
            data = await read.signinTeacher(req.body.uid)
        }
        catch(e){
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