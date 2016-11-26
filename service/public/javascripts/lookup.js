// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    $('#btnLookup').on('click', lookup);
});

// Functions =============================================================

// Lookup Url
function lookup(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#lookup input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    if(errorCount > 0) {
        alert('Please enter a url');
        return false;
    }

    var lookupData = {
        'site': $('#lookup fieldset input#inputUrl').val()
    }

    $.ajax({
        type: 'GET',
        data: lookupData,
        url: '/lookup/page' 
    }).done(function( response ) {

        if (response.msg === '') {

            // Clear the form inputs
            $('#lookup fieldset input').val('');

            // Update the table
            showPageInfo(response);
        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });
};


// Show User Info
function showPageInfo(response) {
    //Populate Info Box
    $('#pageUrl').text(response.url);
    $('#pageStatus').text(response.status);
    $('#pageStory').text(response.story);
};
