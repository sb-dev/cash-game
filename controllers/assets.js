let express = require('express'),
    router = express.Router(),
    sass = require('node-sass'),
    babel = require("babel-core"),
    fs = require('fs'),
    path = require('path'),
    mime = require('mime-types');

router.get("/:assetType/:fileName*",(req,res) => {
    switch (req.params.assetType) {
        case 'javascript':

            switch (req.params.fileName) {
                case 'vendor.js':
                    readJsFiles(res, [
                        "node_modules/jquery/dist/jquery.js",
                        "node_modules/jquery-ui-dist/jquery-ui.js",
                        "node_modules/animejs/anime.js"
                    ]);
                    break;
                case 'app.js':
                    babel.transformFile("assets/javascript/app.js", {}, (err, result) => {
                        res.header("Content-type", "application/javascript")
                        res.send(result.code)
                    });
                    break;
            }

            break;
        case 'css':
            sass.render({
                file: "assets/style/main.scss",
            }, function(err, result) {
                res.header("Content-type", "text/css")
                res.send(result.css);
            });
            break;
        default:
            let filePath = path.join('public', req.params.assetType, req.params.fileName);
            if (!fs.existsSync(filePath)) {
                console.error(`"${filePath}" not found`);
                res.status(404);
                res.type('txt').send('Not found');
                break;
            }
            let fileType = mime.contentType(path.extname(req.params.fileName));
            res.header("Content-type", fileType);
            res.sendFile(path.resolve(filePath));
            break;
    }
});

function readJsFiles(res, filenames) {
    let result = "";
    let index = 0;

    return readFiles(filenames, index, result, res);
}

function readFiles(filenames, index, result, res) {
    fs.readFile(filenames[index], 'utf-8', function(err, content) {
        if (err) {
            console.error(err);
            return;
        }

        result += (index == 0 ? content: (" \n" + content));
        index += 1;

        if(index == filenames.length) {
            res.header("Content-type", "application/javascript");
            res.send(result);
            return;
        }

        return readFiles(filenames, index, result, res);
    })
}

module.exports = router;
