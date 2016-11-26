const util = require('util');

function PageModel(db) {
    this.db = db;
    this.test = 'field';
}

PageModel.prototype.lookup = function(url, callback) {
    db = this.db;
    dbLookup(db, url, function(err, doc){
	if (doc === null) {
	    console.log('db was null, inserting')
	    doc = {
		url: url,
		status: 'unknown',
		story: '?'
	    };
	    dbInsert(db, doc, function(err, status) {
		console.log('insert result: '+err + ',' + util.inspect(status));
		if (err !== null) {
		    callback(err, null);
		} else {
		    callback('', doc);
		}
	    });
	} else {
	    console.log('db found value, returning');

	    callback('', doc);
	}
    });
}

function dbLookup(db, url, callback) {
    var collection = db.get('pagelist');
    collection.findOne({url:url},{},function(err, docs){
	console.log('findOne returned: '+ err + ',' + util.inspect(docs));
	callback(err, docs);
    });
}

function dbInsert(db, obj, callback) {
    var collection = db.get('pagelist');
    collection.insert(obj, callback);
}


function makeModel(db) {
    return new PageModel(db);
}

module.exports = makeModel;
