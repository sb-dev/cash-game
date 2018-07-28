let express = require('express'),
    router = express.Router(),
    path = require('path');

router.use('/public', require('./assets'));

router.get("/",(req,res)=>{
    res.sendFile(path.resolve("views/index.html"));
});

router.get("/settings.json",(req,res)=>{
    res.sendFile(path.resolve("tests/settings.json"));
});

module.exports = router;
