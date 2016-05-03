/** 
 * File: tracker.js
 * 
 * Authors: Christine Rohacz and Kirk Iserman 
 * 
 * File Description: This file is the main javascript for SaguroTrack. It performs the following functions: 
 * - checks the user logging in on index.html 
 * - handles AJAX communication with the server 
 */ 

var track_id = '';
var watch_id = null;
var tracking_data = []; 
watchID = null; 
var coordinates = new Array(); 
var count = 0; 
var checkLogin_result = null;
var Fetcher = window.BackgroundFetch; 
var bgLocationServices; 


/* 
 * Function: beginTracking() 
 *
 * Description: Sends update to the server whenever a user begins tracking
 *
 */ 

function beginTracking() { 
		console.log("beginning tracking");
		/* update database */ 
		$.ajax({
        	type:'POST',
         	url:"http://students.engr.scu.edu/~kiserman/Srdesign/beginTracking.php",
        	data:{
				name: sessionStorage.getItem("name"),
				tracking_id: parseInt(sessionStorage.getItem("id")),
				lati: localStorage.getItem("Latitude"), 
				longi: localStorage.getItem("Longitude"), 
				address: localStorage.getItem("currentAddress")
			},
			async:false,
            cache:false

		});	
}

/* 
 * Function: sendData() 
 * 
 * Precondition: This function is called when location data needs to be sent to the server.
 * 
 * Postcondition: The user's data is sent to the server whenever location updates are recieved 
 * or when the user starts and ends tracking for the first time. 
 *  
 * Description: Send the most recent location data stored in local storage before exiting the application
 */ 

function sendData() {
	console.log("In function sendData in tracker.js");  
	//var url = "http://students.engr.scu.edu/~kiserman/Srdesign/locationDataToServer.php"; 
	$.ajax({
    	type:'POST',
        url:"http://students.engr.scu.edu/~kiserman/Srdesign/locationDataToServer.php",
        data:{
			tracking_id:  parseInt(sessionStorage.getItem("id")), 
			name: sessionStorage.getItem("name"), 
			lati: localStorage.getItem("Latitude"), 
			longi: localStorage.getItem("Longitude"), 
			address: localStorage.getItem("currentAddress"),
			timestamp: localStorage.getItem("timestamp")
		},
        async:false,
        cache:false
    });
}
/* 
 * Function: endTracking() 
 * 
 * Description: End the tracking and return to the home page 
 */  
function endTracking() {
	console.log("Ending tracking: sending session data to server")
    $.ajax({
		type:'POST',
		url: "http://students.engr.scu.edu/~kiserman/Srdesign/endTracking.php", 
		data:{
			tracking_id: parseInt(sessionStorage.getItem("id")),
			name: sessionStorage.getItem("name"),
		},
		success: function(data){
			//alert('success ' + data);
    		console.log('success: ' + data);
  		},
  		error: function(XMLHttpRequest, textStatus, errorThrown){
  			//alert('error posting to endTracking.php ' + errorThrown);
    		alert("Failure to post to endTracking.php with error: " + errorThrown);
  		},	
        async:false,
        cache:false
    });
	
	window.location = "location.html";

}

/* Function: checkLogin() 
 * 
 * Verifies that the tracking ID enetered on the log in page is correct and 
 * when it is, it then sets sessionStorage variables to store the user's ID number 
 * and name so they can be accessed later on. If result is returned, returns true and 
 * if there is no user with that tracking id, returns false. 
 * 
*/ 
function checkLogin(){
		console.log("Checking the login id"); 
		var id = login_form.elements["tracking_id"].value;
		var result = null;
		var returnValue = false; 
		 
		$.ajax({
			type:'POST',
			url:'http://students.engr.scu.edu/~kiserman/Srdesign/checkData.php',
			data:{'id_data': $('#trackingID').val()},
			crossDoman: true, 
			async:false,
			cache:false,
			success:function(data){
				if(!$.trim(data)) { 
					alert("Invalid Tracking ID. Please try again."); 
				}
				else { 
					//alert(data + " is logging in");
					result = data;
					sessionStorage.setItem("id",id);
					sessionStorage.setItem("name", data); 
				} 
			}, 
			error:function(xhr, textStatus, errorThrown){
                        	alert("Unable to connect to Server. Please try again with a better connection.");
                        	console.log("Error connecting to server: " + xhr.responseText); 
							console.log(textStatus); 
							login_success = false;
            }
        });
	
		if(result != null) {
			console.log(sessionStorage.getItem("id"));
			console.log(sessionStorage.getItem("name"));
            document.getElementById("welcome_msg").text = "Welcome, " + sessionStorage.getItem("name");
			return true;
		} 
		else {
			return false;
		} 
	
}

/** 
 * Function: submitCheckIn() 
 * 
 * Description: Submits the check in form on location.htm to the server 
 */ 

function submitCheckIn(){
        var url = "http://students.engr.scu.edu/~kiserman/Srdesign/checkInData.php";
        var posting = $.post(url, {
        	tracking_id: parseInt(sessionStorage.getItem("id")), 
			name: sessionStorage.getItem("name"), 
			client: $('#client').val(), 
            work_num: $('#workorder').val(),                                  
            start_time: $('#timestarted').val(),                              
            end_time: $('#timeended').val(),                                  
            feedback: $('#feedback').val()                                    
       	});                                                                       
		posting.done(function(data) {                                             
                console.log('success' + data);
                window.location.href = "location.html";                           
        });                                     
}
