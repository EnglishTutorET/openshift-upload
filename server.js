var express = require('express');
var morgan = require('morgan');
var formidable = require('formidable');

var path = require('path');
var fs = require('fs');

var app = express();


app.use(express.static("."));
app.use(morgan('tiny'));

var saveFileLocaly = function (req, res) {
    var fileName;
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '/files');
    form.maxFieldsSize = 10 * 1024 * 1024;
    form.keepExtensions = true;

    form.on('file', function (field, file) {
        fileName = path.join(form.uploadDir, file.name);
        fs.rename(file.path, fileName, function (err) {
            if (err) throw err;
            console.log('Renamed');
        });
    });

    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    form.on('end', function () {
        res.end('success');
    });

    form.parse(req);
};


app.post('/upload', function (req, res) {
    saveFileLocaly(req, res);
});

var server = app.listen(8080, function () {
    console.log('Server listening on port 8080');
});