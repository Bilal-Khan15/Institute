const app = require('./routes/user.js')

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

module.exports.app = app;