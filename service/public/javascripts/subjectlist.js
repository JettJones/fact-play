// Userlist data array for filling in info box
var subjectData = [];
var activeSubject = null;
// DOM Ready =============================================================
$(document).ready(function() {

    $('#submitSubject').on('click', addSubject);
    $('#submitCite').on('click', addCitation);

    refreshSubjects()
});

// Functions =============================================================

function clickSubject(event) {
    // Prevent Link from Firing
    event.preventDefault();

    console.log('clickSubject #' + event.target.id)

    // Retrieve username from link rel attribute
    var thisId = event.target.id

    // Get Index of object based on id value
    var arrayPosition = subjectData.map(function(arrayItem) {
	return arrayItem._id; }).indexOf(thisId);

    // Get our User Object
    var selectedObject = subjectData[arrayPosition];

    //Populate Info Box
    showSubject(selectedObject)
};

function showSubject(sub) {
    activeSubject = sub;
    $('#inputId').text(sub._id);
    $('#subjectTitle').text(sub.title);
    $('#subjectDescription').text(sub.description);

    cites = sub.citations
    listContent = ''
    if (cites) {
	$.each(cites, function(){
            listContent += '<li>' + this + '</li>';
	});
    }
    $('#subjectCitations').html(listContent);
};

function refreshSubjects() {

    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/subjects', function( data ) {

	// cache the data for click handling
	subjectData = data;

        $.each(data, function(){
	    escaped = $('<div/>').text(this.title + ':' + this.description).html();
            tableContent += '<li id='+this._id+'>';
            tableContent += escaped;
	    tableContent += '</li>';
        });

        // Inject the whole content string into our existing HTML
        $('#subjectList ul').html(tableContent);
	$('li').on('click', clickSubject);
    });
};

// Make a subject
function addSubject(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#formAddSub input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    if(errorCount > 0) {
        alert('Fill in all fields');
        return false;
    }

    var subData = {
	'title': $('#formAddSub input#inputTitle').val(),
        'description': $('#formAddSub input#inputDescription').val()
    }

    $.ajax({
        type: 'POST',
        data: subData,
        url: '/subjects',
	dataType: 'JSON'
    }).done(function( response ) {
        if (response.msg === '') {
            // Clear the form inputs
            $('#formAddSub input').val('');
	    refreshSubjects();
        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });
};

function addCitation(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    var id = $('#inputId').text();
    if ( $('#inputUrl').val() === '') { errorCount++; }
    if ( id === '' ) { errorCount++; }
    
    if(errorCount > 0) {
        alert('Fill in all fields');
        return false;
    }

    var citeData = {
	'url': $('#formAddCite input#inputUrl').val()
    }
    
    $.ajax({
        type: 'POST',
        data: citeData,
        url: '/subjects/'+id+'/citations',
	dataType: 'JSON'
    }).done(function( response ) {
        if (response.msg === '') {
            // Clear the form inputs
	    value = $('#formAddCite input#inputUrl').val()
            $('#formAddCite input').val('');

	    array = activeSubject.citations || []
	    array.push(value);
	    activeSubject.citations = array;
	    showSubject(activeSubject);
        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });
};
