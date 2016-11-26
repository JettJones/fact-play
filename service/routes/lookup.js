var express = require('express');
var router = express.Router();
const util = require('util');

/* GET userlist. */
router.get('/', function(req, res) {
    res.render('lookup', { title: 'Lookup' });
});

router.get('/page', function(req, res) {
    site = req.query.site;
    console.log(site);
    req.model.lookup(site, function(err, result) {
	console.log('lookup complete with ' + err + ',' + util.inspect(result));
	if (err) {
	    res.send({ msg: err });
	} else {
	    result.msg = '';
	    delete result._id;
	    res.send(result);
	}
    });
});

module.exports = router;
