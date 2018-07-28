let express = require('express'),
    app = express(),
    router = express.Router()

router.use((req,res,next) => {
    console.log("/" + req.method)
    next();
})

app.use(require('./controllers'))

app.listen(3000,() => {
    console.log("CashGame started on Port 3000...")
})