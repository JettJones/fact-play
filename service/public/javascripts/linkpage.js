// Userlist data array for filling in info box
var subjectData = [];
var activeSubject = null;
// DOM Ready =============================================================
$(document).ready(function() {

    $('#submitFilter').on('click', refreshSubjects);

    refreshSubjects()
});

// Functions =============================================================

function refreshSubjects() {

    filter = $('#inputFilter').val();

    var path = '/subjects';
    if (filter) {
	path = path + '?title=' + filter;
    }
    // jQuery AJAX call for JSON
    $.getJSON( path, function( data ) {

	var tableContent = '';
	// cache the data for click handling
	subjectData = data;

        $.each(data, function(){
	    escaped = $('<div/>').text(this.title).html();
            tableContent += '<tr><td><a href="#" id="'+this._id+'">Link</a></td>';
            tableContent += '<td>'+escaped+'</td>';
            tableContent += '<td>'+this.citations[0]+'</td>';
	    tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML
        $('#subjectList tbody').html(tableContent);
	$('#subjectList a').on('click', linkSubject);
    });
};

// Add the subject to this page
function linkSubject(event) {
    event.preventDefault();

    console.log(event);
    var subId = event.target.id;
    var pageId = $('#pageId').text()
    console.log(subId);

    var subData = {'subject': subId };
    
    $.ajax({
        type: 'PUT',
        data: subData,
        url: '/pages/'+pageId+'/subject',
	dataType: 'JSON'
    }).done(function( response ) {
        if (response.msg === '') {
            $('span#subject').text(subId);
        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });
    
};
