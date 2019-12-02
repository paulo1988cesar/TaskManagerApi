const mongose = require('mongoose')

mongose.connect(process.env.MONGOOSE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})