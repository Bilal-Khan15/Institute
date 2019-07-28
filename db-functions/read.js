var exports = module.exports = {},
   utilsFunctions = require('../utils/functions'),
   constants = require('../utils/constant');

const user = require('../models/user.js')

const signinTeacher = (uid) => {
    try{
        return new Promise((resolve,reject)=>{

            user.db.collection('users').doc(uid).get()
                .then((res) => {
                    let userData = res.data();
                    resolve(userData)
                })
                .catch((e) => {
                    const mess = e.message
                    reject({ message: mess })
                })
            }) 
    }  catch (e) {
        console.log(e);
        throw new Error(e);
    }
}

signinStudent = (uid) => {
    return new Promise((resolve, reject) => {
        user.db.collection('users').doc(uid).get()
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

signinParent = (uid) => {
    return new Promise((resolve, reject) => {
        user.db.collection('users').doc(uid).get()
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

module.exports = {
    signinTeacher: signinTeacher,
    signinStudent: signinStudent,
    signinParent: signinParent
}