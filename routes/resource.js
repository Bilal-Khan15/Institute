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
 * @apiName addResource
 
 *
 * @apiParam {title} 
 * @apiParam {description} 
 * @apiParam {grade} 
 * @apiParam {subject} 
 * @apiParam {teacher_id} 
 * @apiParam {author} 
 * @apiParam {file} 
 * @apiParam {video_url} 
 * @apiParam {tags} 
 * 
 * @apiSuccess {JSON object} 
 * 
 */
app.post('/addResource', async (req, res) => {
    if((req.body.title.trim() == '') || (!validator.isLength(req.body.title, min= 1, max= 60))  
        || (req.body.description.trim() == '') || (!validator.isLength(req.body.description, min= 0, max= 1000)) 
        || (req.body.grade.trim() == '') 
        || (req.body.subject.trim() == '') 
        || (req.body.teacher_id.trim() == '') 
        || (req.body.author.trim() == '') || (!validator.isLength(req.body.author, min= 2, max= undefined))){
            return res.status(404).send({ error: 'Please fill all the fields properly !' })
        }

        ret = await insert.addResource(req.body.title, req.body.description, req.body.grade, req.body.subject, req.body.teacher_id, req.body.author, req.body.file, req.body.video_url, req.body.tags)

        req.body.time = ret[0]
        req.body.is_archive = ret[1]
        req.body.id = ret[2]
    
        res.send({
            result: req.body
        })
})

/**
 * @api {post}
 * @apiName removeResource
 
 *
 * @apiParam {id} id Users unique ID.
 *
 * @apiSuccess {String} 
 * 
 */
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

/**
 * @api {post}
 * @apiName updateResource
 
 *
 * @apiParam {id} 
 * @apiParam {title} 
 * @apiParam {description} 
 * @apiParam {grade} 
 * @apiParam {subject} 
 * @apiParam {teacher_id} 
 * @apiParam {file} 
 * @apiParam {video_url} 
 * @apiParam {author} 
 * @apiParam {time} 
 * @apiParam {is_archive} 
 *
 * @apiSuccess {String} 
 * 
 */
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

/**
 * @api {get}
 * @apiName library
 *
 * @apiSuccess {String array} array of resources
 */
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
    else { return 0 }

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

/**
 * @api {post}
 * @apiName library/filter
 
 *
 * @apiParam {subject} 
 * @apiParam {time} 
 * @apiParam {grade} 
 *
 * @apiSuccess {String array} array of reources 
 * 
 */
app.post('/library/filter', (req, res) => {
    console.log(req.body.subject)
    var time = getdate(req.body.time)
    user.db.collection('resources').where('time', '>=', time).get().then(async (snapshot) => {
        let data = []
        await snapshot.docs.forEach(doc => {
            let chk = false
            if(req.body.subject != undefined){
                req.body.subject.forEach(sub => {
                    if ((!doc.data().is_archive) && (doc.data().subject.toLowerCase() == sub.label.toLowerCase())) {
                        data.push(doc.data())
                        chk = true
                    }
                });
            }

            if(req.body.grade != undefined){
                req.body.grade.forEach(sub => {
                    if ((!doc.data().is_archive) && (doc.data().grade.toLowerCase() == sub.label.toLowerCase()) && (!chk)) {
                        data.push(doc.data())
                        chk = true
                    }
                });
            }
        });

        if ((req.body.time != undefined) && (req.body.subject == undefined) && (req.body.subject == undefined))
        {
            snapshot.docs.forEach((doc) => {
                data.push(doc.data())
            });
        }

        res.send({
            resources: data
        })
    });
})

/**
 * @api {get}
 * @apiName library/myLibrary
 
 *
 * @apiParam {id} id Users unique ID.
 *
 * @apiSuccess {String array} array of resources
 */
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

/**
 * @api {post}
 * @apiName library/myLibrary/filter
 
 *
 * @apiParam {subject} 
 * @apiParam {time} 
 * @apiParam {grade} 
 *
 * @apiSuccess {String array} array of reources 
 * 
 */
app.post('/library/myLibrary/filter', (req, res) => {
    var time = getdate(req.body.time)
    user.db.collection('resources').where('teacher_id', '==', req.body.id).where('time', '>=', time).get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            let chk = false
            if(req.body.subject != undefined){
                req.body.subject.forEach(sub => {
                    if ((!doc.data().is_archive) && (doc.data().subject.toLowerCase() == sub.label.toLowerCase())) {
                        data.push(doc.data())
                        chk = true
                    }
                });
            }

            if(req.body.grade != undefined){
                req.body.grade.forEach(sub => {
                    if ((!doc.data().is_archive) && (doc.data().grade.toLowerCase() == sub.label.toLowerCase()) && (!chk)) {
                        data.push(doc.data())
                        chk = true
                    }
                });
            }
        });

        if ((req.body.time != undefined) && (req.body.subject == undefined) && (req.body.subject == undefined))
        {
            snapshot.docs.forEach((doc) => {
                data.push(doc.data())
            });
        }

        res.send({
                resources: data
        })
    });
})

/**
 * @api {post}
 * @apiName addtag
 
 *
 * @apiParam {subject} 
 * @apiParam {grade} 
 *
 * @apiSuccess {String} 
 * 
 */
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

/**
 * @api {get}
 * @apiName tags
 
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String array} array of subject tags
 * @apiSuccess {String array} array of grade tags
 */
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

/**
 * @api {post}
 * @apiName views
 
 *
 * @apiParam {id} id Users unique ID.
 *
 * @apiSuccess {String} 
 * 
 */
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

/**
 * @api {post}
 * @apiName helpful
 
 *
 * @apiParam {id} 
 * @apiParam {sid} 
 *
 * @apiSuccess {String} 
 * 
 */
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

/**
 * @api {post}
 * @apiName nothelpful
 
 *
 * @apiParam {id} 
 * @apiParam {sid} 
 *
 * @apiSuccess {String} 
 * 
 */
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
    
module.exports = app;