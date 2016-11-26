var express = require('express');
var router = express.Router();
const util = require('util');

router.get('/subjectlist', function(req, res) {
    var db = req.db;
    var clxn = db.get('subjects');
    clxn.find({},{}, function(e,docs){
	res.render('subjectlist', {
	    "list" : docs
	});
    });
});

module.exports = router;
