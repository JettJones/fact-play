// Userlist data array for filling in info box
var pageData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    refreshPages()
});

// Functions =============================================================

function refreshPages() {

    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/pages', function( data ) {

	// cache the data for click handling
	pageData = data;

        $.each(data, function(){
            tableContent += '<tr>';
	    tableContent += '<td>'+(this.title || '?')+'</td>';
	    tableContent += '<td>'+this.url+'</td>';
	   // tableContent += '<td>'+(this.count || '?')+'</td>';
	   // tableContent += '<td>'+(this.created || '?')+'</td>';
	    tableContent += '<td><a href="linkpage/'+this._id+'">Edit</a></td>';
	    tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML
        $('#pagelist tbody').html(tableContent);
    });
};
