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
            || (req.body.nic.trim() == '') || (!validator.isLength(req.body.nic, min = 13, max = 16)) || (!validator.isNumeric(req.body.nic))
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
        insert.signupStudent(req.body.nic, req.body.name, req.body.guardian_name, req.body.guardian_phone, req.body.phone, req.body.address, req.body.guardian_email, req.body.guardian_nic, req.body.date, req.body.month, req.body.year, req.body.email, req.body.pwd)
        res.send({
            result: req.body
        })
    }
})

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
            data = await read.signinTeacher(req.body.id, req.body.pwd)
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
    else if (req.body.type === 'student') {
        let data;
        try {
            data = await read.signinStudent(req.body.id, req.body.pwd)
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
            data = await read.signinParent(req.body.id, req.body.pwd)
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
    else if (req.body.type === 'admin') {
        let data;
        try {
            data = await read.signinAdmin(req.body.id, req.body.pwd)
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