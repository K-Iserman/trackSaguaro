var track_id = '';
var watch_id = null;
var tracking_data = []; 
watchID = null; 
var coordinates = new Array(); 
var count = 0; 
var checkLogin_result = null;
var Fetcher = window.BackgroundFetch; 


// Error
function geoError(error){
	alert("Error in tracker.js, line 88 " + error.message); 
	console.log(error);
}


function geoSuccess(position) {
			tracking_data.push(position);
           	$("#currentLat").addClass("hidden");
	   		$("#currentLon").addClass("hidden");  
			document.getElementById('currentLat').innerHTML = position.coords.latitude;
            document.getElementById('currentLon').innerHTML = position.coords.longitude;
            	
			//initMap(position.coords.latitude, position.coords.longitude);
            console.log("got position");
            localStorage.setItem("Latitude", position.coords.latitude);
            localStorage.setItem("Longitude", position.coords.longitude);

            var myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude};
            alert("got location");
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
               	title: 'Hello World!'
            });
            	
			coordinates[count] = new Array(); 
            coordinates[count] = [position.coords.latitude, position.coords.longitude];
            count++;
            console.log(coordinates);
            	
			var geocoder = new google.maps.Geocoder; 
            var infowindow = new google.maps.InfoWindow;
            geocodeLatLng(geocoder, map, infowindow); 

            	$.ajax({
                	type:'POST',
                	url:"http://students.engr.scu.edu/~kiserman/Srdesign/mobileDataToServer.php",
                	data:{
                    		tracking_id: parseInt(sessionStorage.getItem("id")),
                    		name: sessionStorage.getItem("name"),
                    		lati: position.coords.latitude,
                    		longi: position.coords.longitude,
                    		address: localStorage.getItem("currentAddress")

                	},
                	async:false,
                	cache:false
            	})
           $("#startTracking_start").removeClass("visible").addClass("hidden");
        	$("#endTracking_end").removeClass("hidden").addClass("visible");
			$("#log_out").addClass("hidden"); 
        	$("#location_data").removeClass("hidden").addClass("visible"); 
}
/* 
 * Function: beginTracking() 
 *
 * Description: begins tracking whenever the page is reloaded. If the page is brought up for the first time, 
 * recent activity is updated through beginTracking.php
 *
 */ 

function beginTracking() { 
		var request_type = "begin"; 
		
		sessionStorage.setItem("tracking_status", 1);
		/* update database */ 
		var url = "http://students.engr.scu.edu/~kiserman/Srdesign/beginTracking.php"; 
		//alert(sessionStorage.getItem("name") + " started tracking");
		var posting = $.post(url, { 
			type: request_type,  
			name: sessionStorage.getItem("name"),
			tracking_id: parseInt(sessionStorage.getItem("id"))
		}); 
		posting.done(function(result) { 
			console.log(result); 
		}); 	

		run();
}

function run() {
   		//start tracking the user 
    	var watchId = navigator.geolocation.watchPosition(geoSuccess, geoError, {frequency: 30000}); 
} 


/* 
 * Function: sendData() 
 * 
 * Precondition: This function is called when the user decides to end tracking. 
 * Postcondition: the user's data is sent to the server and then endTracking is called. 
 * Description: send the most recent location data and info the the database before exiting the application
 */ 

function sendData() {
	console.log("User touched end tracking, in function sendData in tracker.js");  
	var url = "http://students.engr.scu.edu/~kiserman/Srdesign/locationDataToServer.php"; 
	var posting = $.post(url, {
			tracking_id:  parseInt(sessionStorage.getItem("id")), 
			name: sessionStorage.getItem("name"), 
			lati: localStorage.getItem("Latitude"), 
			longi: localStorage.getItem("Longitude"), 
			address: localStorage.getItem("currentAddress")
		});
		posting.done(function(data) { 
			console.log('success' + data); 
		});   
	endTracking();  		
}
/* 
 * Function: endTracking() 
 * 
 * Description: End the tracking and return to the home page 
 */  
function endTracking() {
	console.log("Ending tracking: sending session data to server")
	if(navigator.geolocation) { 
		navigator.geolocation.clearWatch(this.watchId); 
		this.watchId = null; 
	}
	/* 
	var url = "http://students.engr.scu.edu/~kiserman/Srdesign/endTracking.php"; 
	var posting = $.post(url, {
                name: sessionStorage.getItem("name"),
                tracking_id: parseInt(sessionStorage.getItem("id"))
        });
        posting.done(function(result) {
        		alert(result);
                console.log(result);
        });
    */ 
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
	$("#log_out").addClass("visible"); 
	navigator.geolocation.clearWatch(watchID);
	sessionStorage.setItem("tracking_status", 0); 
	
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
            document.getElementById("welcome_msg").innerHTML = "Welcome, " + sessionStorage.getItem("name");
			return true;
		} 
		else {
			return false;
		} 
	
}

function checkInBack(){
    window.location = "location.html";
}


function submitCheckIn(){
	console.log("submitting check in data"); 
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
	
	/* Function called when the posting has finished */ 
	posting.done(function(data) {                                             
		console.log('Posting check in data was success' + data);
        	returnFromCheckIn();                          
    }); 

    posting.fail(function(xhr, textStatus, errorThrown) { 
    	console.log("Posting check in data failed"); 
    	console.log(xhr.responseText);
    });                                   
}

function returnFromCheckIn() { 
	var form = document.getElementById("checkin_form"); 
    form.className = "hidden"; 
    document.getElementById("map").className = "visible"; 
    document.getElementById("check_in_btn").className = "visible button button-positive"; 

}
		
