var exports = module.exports = {},
   utilsFunctions = require('../utils/functions'),
   constants = require('../utils/constant');

const db = require('../models/user.js')

const signinTeacher = (uid) => {
    try{
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
    }  catch (e) {
        console.log(e);
        throw new Error(e);
    }
}

module.exports = {
    signinTeacher: signinTeacher
}