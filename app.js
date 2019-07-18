const express = require('express')
const bodyParser = require('body-parser')
var admin = require('firebase-admin');
var cors = require('cors')
admin.initializeApp();
const db = admin.firestore();

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
const port = process.env.PORT || 3000
app.use(cors())


function addResouce(Description, Grade, TeacherId, Title,video_url) {

    db.collection('Resources').add({
        Description,
        Grade,
        TeacherId,
        Title,
        time: Date.now(),
        video_url
    })
    .then((doc)=>{
        console.log('doc ===>', doc.id)
        let ResourceID = doc.id
        db.collection('Teachers').doc(TeacherId).get()
        .then((res)=>{
            let userData = res.data()
            // let Resource = []
            // Resource.push(ResourceID)
            console.log('resources ===>',userData.Resources)
            userData.Resources ? userData.Resources = [...userData.Resources, ResourceID] : userData.Resources =[ResourceID]
            db.collection('Teachers').doc(TeacherId).set(userData)
            .then(()=>console.log('added Resource'))
            .catch((e)=>console.log(e))
        })
        .catch((e) => console.log(e))
    })
    .catch((e) => console.log(e))

}

addResouce('This math video tutorial provides a basic introduction into number systems. It explains how to interconvert between decimal, binary, octal, hexadecimal and BCD using successive division and multiplication of base powers.', '2nd year','oi54FJxirqWa4NfOK4RKPch6El23','Number System','https://www.youtube.com/watch?v=L2zsmYaI5ww')
 

function signupParent(type, Name, NIC, Address, Phone, Email) {
    db.collection(type).add({
        type,
        Name,
        NIC,
        Address,
        Phone,
        Email
    })
}

function signupTeacher(type, Name, NIC, Address, Phone, Email, Date, Month, Year,Uid) {
    db.collection(type).doc(Uid).set({
        type,
        Name,
        NIC,
        Address,
        Phone,
        Email,
        Date,
        Month,
        Year
    })
}

function signupStudent(type, Name, GuardianName, GuardianPhone, StudentPhone, School, Address, GuardianEmail, GuardianNIC, Date, Month, Year, StudentEmail) {
    db.collection(type).add({
        type,
        Name,
        GuardianName,
        GuardianPhone,
        StudentPhone,
        School,
        Address,
        GuardianEmail,
        GuardianNIC,
        Date,
        Month,
        Year,
        StudentEmail
    })
}

signinTeacher = (uid) => {
    return new Promise((resolve,reject)=>{
        db.collection('Teachers').doc(uid).get()
            .then((res) => {
                let userData = res.data();
                resolve(userData)
            })
            .catch((e) => {
                const mess = e.message
                reject({ message: mess })
            })
    }) 
}

app.post('/signup', (req, res) => {
    console.log('body ===>',req.body)
    console.log('type ===>', req.body.type)
    if (req.body.type == 'Parents') {
        signupParent(req.body.type, req.body.Name, req.body.NIC, req.body.Address, req.body.Phone, req.body.Email)
        res.send({
            result: req.body.Name + ' has been Addressed as ' + req.body.type
        })
    }
    if (req.body.type == 'Teachers') {
        signupTeacher(req.body.type, req.body.Name, req.body.NIC, req.body.Address, req.body.Phone, req.body.Email, req.body.Date, req.body.Month, req.body.Year, req.body.Uid)
        res.send({
            result: req.body.Name + ' has been Addressed as ' + req.body.type
        })
    }
    if (req.body.type == 'Students') {
        signupParent(req.body.type, req.body.Name, req.body.GuardianName, req.body.GuardianPhone, req.body.StudentPhone, req.body.School, req.body.Address, req.body.GuardianEmail, req.body.GuardianNIC, req.body.Date, req.body.Month, req.body.Year, req.body.StudentEmail)
        res.send({
            result: req.body.Name + ' has been Addressed as ' + req.body.type
        })
    }
})

app.post('/addResource', (req, res) => {
    addResouce(req.body.Description, req.body.Grade, req.body.TeacherId, req.body.Title)

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

app.post('/signin', async (req,res) => {
    if (req.body.type == 'Teachers') {
        let data;
        try{
            data = await signinTeacher(req.body.uid)
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

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})