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

router.get('/pagelist', function(req, res) {
    res.render('pagelist', {});
});

router.get('/linkpage/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('pagelist');
    var id = req.params.id;
    collection.findOne({_id:id},{},function(err, doc){
	console.log(doc);
	res.render('linkpage', doc);
    });
});


module.exports = router;
