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
 * @apiName invite
 
 *
 * @apiParam {email} 
 * @apiParam {institute_id} 
 *
 * @apiSuccess {JSON object} 
 * 
 */
app.post('/invite', (req, res) => {
    insert.invite(req.body.email, req.body.institute_id)

    res.send({
        result: req.body
    })
})


/**
 * @api {get}
 * @apiName GetUser
 
 *
 * @apiParam {iv} iv part of decrypt
 * @apiParam {id} id part of decrypt
 * @apiParam {email} user email
 *
 * @apiSuccess {JSON object} object of passed param
 */
app.get('/open_invite', async(req, res) => {
    email = await insert.open_invite(req.query.iv, req.query.id)
    
    req.query.email = email

    res.send({
        result: req.query
    })
})

/**
 * @api {post}
 * @apiName save_invite
 
 *
 * @apiParam {email} 
 * @apiParam {pwd} 
 * @apiParam {iv} 
 * @apiParam {id} 
 *
 * @apiSuccess {JSON object} 
 * 
 */
app.post('/save_invite', (req, res) => {
    insert.save_invite(req.body.email, req.body.pwd, req.body.iv, req.body.id)

    res.send({
        result: req.body
    })
})

/**
 * @api {get}
 * @apiName institutes
 *
 * @apiSuccess {String array} array of institutes
 */
app.get('/institutes', (req, res) => {
    user.db.collection('institutes').get().then(snapshot => {
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

/**
 * @api {post}
 * @apiName inst_signup
 
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
 * @apiParam {student_phone} 
 * @apiParam {address} 
 * @apiParam {guardian_email} 
 * @apiParam {guardian_nic} 
 * @apiParam {date} 
 * @apiParam {month} 
 * @apiParam {year} 
 * @apiParam {student_email} 
 * @apiParam {id} 
 * @apiSuccess {JSON object} 
 */
app.post('/inst_signup', (req, res) => {
    if (req.body.type == 'parent') {
        insert.inst_signupParent(req.body.institute_id, req.body.institute_name, req.body.type, req.body.name, req.body.nic, req.body.address, req.body.phone, req.body.email, req.body.date, req.body.month, req.body.year, req.body.id)
        res.send({
            result: req.body
        })
    }
    if (req.body.type == 'teacher') {
        insert.inst_signupTeacher(req.body.date_of_joining, req.body.institute_id, req.body.institute_name, req.body.type, req.body.name, req.body.nic, req.body.address, req.body.phone, req.body.email, req.body.date, req.body.month, req.body.year, req.body.id, req.body.qualification)
        res.send({
            result: req.body
        })
    }
    if (req.body.type == 'student') {
        insert.inst_signupStudent(req.body.student_nic, req.body.date_of_joining, req.body.institute_id, req.body.institute_name, req.body.type, req.body.name, req.body.guardian_name, req.body.guardian_phone, req.body.student_phone, req.body.address, req.body.guardian_email, req.body.guardian_nic, req.body.date, req.body.month, req.body.year, req.body.student_email, req.body.id)
        res.send({
            result: req.body
        })
    }
})

/**
 * @api {get}
 * @apiName inst_students
 *
 * @apiSuccess {String array} array of institute students
 */
app.get('/inst_students', (req, res) => {
    user.db.collection('institute_students').get().then(snapshot => {
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

/**
 * @api {get}
 * @apiName inst_teachers
 *
 * @apiSuccess {String array} array of institute teachers
 */
app.get('/inst_teachers', (req, res) => {
    user.db.collection('institute_teachers').get().then(snapshot => {
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

/**
 * @api {post}
 * @apiName update_inst_student
 
 *
 * @apiParam {id} 
 * @apiParam {date_of_joining} 
 * @apiParam {institute_id}
 * @apiParam {institute_name} 
 * @apiParam {type} 
 * @apiParam {name} 
 * @apiParam {guardian_name} 
 * @apiParam {guardian_email} 
 * @apiParam {guardian_phone} 
 * @apiParam {student_phone} 
 * @apiParam {address} 
 * @apiParam {guardian_email} 
 * @apiParam {student_nic} 
 * @apiParam {guardian_nic} 
 * @apiParam {date} 
 * @apiParam {month} 
 * @apiParam {year} 
 * @apiParam {student_email} 
 * @apiSuccess {String} 
 * 
 */
app.post('/update_inst_student', (req, res) => {
    user.db.collection('institute_students').doc(req.body.id).get().then((res) => {
        let data = res.data()
        console.log(data)
        if (req.body.date_of_joining) {
            data.date_of_joining = req.body.date_of_joining
        }
        if (req.body.institute_id) {
            data.institute_id = req.body.institute_id
        }
        if (req.body.institute_name) {
            data.institute_name = req.body.institute_name
        }
        if (req.body.type) {
            data.type = req.body.type
        }
        if (req.body.name) {
            data.name = req.body.name
        }
        if (req.body.guardian_name) {
            data.guardian_name = req.body.guardian_name
        }
        else if (req.body.guardian_phone) {
            data.guardian_phone = req.body.guardian_phone
        }
        if (req.body.student_phone) {
            data.student_phone = req.body.student_phone
        }
        if (req.body.address) {
            data.address = req.body.address
        }
        if (req.body.guardian_email) {
            data.guardian_email = req.body.guardian_email
        }
        if (req.body.student_nic) {
            data.student_nic = req.body.student_nic
        }
        if (req.body.guardian_nic) {
            data.guardian_nic = req.body.guardian_nic
        }
        if (req.body.date) {
            data.date = req.body.date
        }
        if (req.body.month) {
            data.month = req.body.month
        }
        if (req.body.year) {
            data.year = req.body.year
        }
        if (req.body.student_email) {
            data.student_email = req.body.student_email
        }

        user.db.collection('institute_students').doc(req.body.id).set(data)
    })

    res.send({
        result: 'Targeted institute student has been Updated.'
    })
})

/**
 * @api {post}
 * @apiName update_inst_teacher
 
 *
 * @apiParam {id} 
 * @apiParam {date_of_joining} 
 * @apiParam {institute_id} 
 * @apiParam {institute_name} 
 * @apiParam {type} 
 * @apiParam {name} 
 * @apiParam {nic} 
 * @apiParam {address} 
 * @apiParam {phone} 
 * @apiParam {email} 
 * @apiParam {date} 
 * @apiParam {month} 
 * @apiParam {year} 
 * @apiParam {resources} 
 * @apiParam {qualification} 
 *
 * @apiSuccess {String array} array of announcements 
 * 
 */
app.post('/update_inst_teacher', (req, res) => {
    user.db.collection('institute_teachers').doc(req.body.id).get().then((res) => {
        let data = res.data()
        console.log(data)
        if (req.body.date_of_joining) {
            data.date_of_joining = req.body.date_of_joining
        }
        if (req.body.institute_id) {
            data.institute_id = req.body.institute_id
        }
        if (req.body.institute_name) {
            data.institute_name = req.body.institute_name
        }
        if (req.body.type) {
            data.type = req.body.type
        }
        if (req.body.name) {
            data.name = req.body.name
        }
        if (req.body.nic) {
            data.nic = req.body.nic
        }
        else if (req.body.address) {
            data.address = req.body.address
        }
        if (req.body.phone) {
            data.phone = req.body.phone
        }
        if (req.body.email) {
            data.email = req.body.email
        }
        if (req.body.date) {
            data.date = req.body.date
        }
        if (req.body.month) {
            data.month = req.body.month
        }
        if (req.body.year) {
            data.year = req.body.year
        }
        if (req.body.resources) {
            data.resources = req.body.resources
        }
        if (req.body.qualification) {
            data.qualification = req.body.qualification
        }

        user.db.collection('institute_teachers').doc(req.body.id).set(data)
    })

    res.send({
        result: 'Targeted institute teacher has been Updated.'
    })
})

/**
 * @api {post}
 * @apiName remove_inst_student
 
 *
 * @apiParam {id} id Users unique ID.
 *
 * @apiSuccess {String} 
 * 
 */
app.post('/remove_inst_student', (req, res) => {
    user.db.collection('institute_students').doc(req.body.id).get().then((res) => {
        let data = res.data()

        data.is_archive = true

        user.db.collection('institute_students').doc(req.body.id).set(data)
    })

    res.send({
        result: 'Targeted student has been deleted.'
    })
})

/**
 * @api {post}
 * @apiName remove_inst_teacher
 
 *
 * @apiParam {id} id Users unique ID.
 *
 * @apiSuccess {String} 
 * 
 */
app.post('/remove_inst_teacher', (req, res) => {
    user.db.collection('institute_teachers').doc(req.body.id).get().then((res) => {
        let data = res.data()

        data.is_archive = true

        user.db.collection('institute_teachers').doc(req.body.id).set(data)
    })

    res.send({
        result: 'Targeted teacher has been deleted.'
    })
})

app.post('/addInst', (req, res) => {
    insert.addInst(req.body.fee, req.body.ground, req.body.lib, req.body.loc, req.body.name, req.body.phd)
    
    res.send({
        result: req.body
    })
})

app.post('/instDetails/filter', (req, res) => {
    user.db.collection('institute_details').where('location', '==', req.body.loc).get().then(async (snapshot) => {
        let data = []
        let chk = false
        await snapshot.docs.forEach(doc => {
            if(((req.body.fee != undefined)&&(doc.data().fee <= req.body.fee))&&
            ((req.body.ground != undefined)&&(doc.data().ground.toLowerCase() == req.body.ground.toLowerCase()))&&
            ((req.body.lib != undefined)&&(doc.data().library.toLowerCase() == req.body.lib.toLowerCase()))&&
            ((req.body.phd != undefined)&&(doc.data().phd >= req.body.phd)))
            {
                data.push(doc.data())
                chk= true
            }
        });

        if (chk)
        {
            res.send({
                resources: data
            })
        }else{
            return res.send({ resources: {
                name: 'Government School',
                fee: '0',
                ground: 'false',
                library: 'false',
                phd: '0',
                location: req.body.loc
            }
            })
        }
    });
})

module.exports = app;