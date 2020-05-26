/** 
 * File: location.js
 * 
 * Jasvscript file that performs the following tasks for location.html: 
 * 
 * - Initializing google maps map 
 * - Calling getCurrentPosition as initial call 
 * - Start background geolocation services 
 * - Finish background geolocation services 
 * - Load the check in form 
 * - Submit the check in form 
 * - Log out 
 */ 


var infoWindow;
var map;
var bgLocationServices; 


/* initMap is the callback for loading google maps API javascript src */ 
function initMap() {
	console.log("initializing map"); 
	/* call getCurrentPosition at least once so user allows location to be tracked */ 
	navigator.geolocation.getCurrentPosition(showPosition, showError, {enableHighAccuracy:true}); 
} 

/** Successfull callback for getCurrentPosition **/ 
function showPosition(position) {   // enable ur gps, it takes sometime to call till now wait   
	console.log("Successfully got position"); 

	var lat = position.coords.latitude;
	var longi = position.coords.longitude;
    
	/* update with starting location */ 
    document.getElementById('currentLat').innerHTML = position.coords.latitude;
	document.getElementById('currentLon').innerHTML = position.coords.longitude;


	mapCenter = new google.maps.LatLng(lat, longi); 

	myOptions = {
		zoom:10,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: mapCenter,
	};
  
	console.log("Got position and initializing map"); 
	/* initialize maps */ 
    map = new google.maps.Map(document.getElementById("map"), myOptions);
             
	marker = new google.maps.Marker({
		position: new google.maps.LatLng(lat, longi),
   		map: map,
    	title:"Current Location!"
    })

	/* Geocode the lat and lng */ 
	var geocoder = new google.maps.Geocoder; 
	var infowindow = new google.maps.InfoWindow;
    geocodeLatLng(geocoder, map, infowindow); 
}

/** Failure callback for getCurrentPosition **/ 
function showError(error){
	alert("Getting the error: " + error);
	console.log("Error: " + error); 
}


function startBackgroundGeolocation() { 


	/*call geolocation once to initialize */ 
	//navigator.geolocation.getCurrentPosition(showPosition, showError, {enableHighAccuracy:true}); 

	console.log("starting background geolocation tracking");
	//alert("starting background geolocation");
	document.getElementById('tracking_status').innerHTML = "Active"; 
	/* set tracking status to 1 */ 
	sessionStorage.setItem("tracking_status", 1);


	bgLocationServices = window.plugins.backgroundLocationServices;
		/*Confgiure bgLocationServices*/ 	
		bgLocationServices.configure({ 
			desiredAccuracy: 20, // Desired Accuracy of the location updates (lower means more accurate but more battery consumption)
     		distanceFilter: 5, // (Meters) How far you must move from the last point to trigger a location update
     		debug: true, // <-- Enable to show visual indications when you receive a background location update
     		interval: 15000, // (Milliseconds) Requested Interval in between location updates.
     		//Android Only
     		notificationTitle: 'SaguaroTrack', // customize the title of the notification
     		notificationText: 'Tracking', //customize the text of the notification
     		fastestInterval: 5000, // <-- (Milliseconds) Fastest interval your app / server can handle updates
     		useActivityDetection: true // Uses Activitiy detection to shut off gps when you are still (Greatly enhances Battery Life)
		}); 

		/* Geocode the lat and lng */ 
	
	var geocoder = new google.maps.Geocoder; 
	var infowindow = new google.maps.InfoWindow;
    geocodeLatLng(geocoder, map, infowindow); 

    /* every time we get a new location, update the local storage and hidden elements */ 
	bgLocationServices.registerForLocationUpdates(function(location) { 
		//console.log("We got a BG update" + JSON.stringify(location)); 
		console.log("trackSaguaro just got a location update" + JSON.stringify(locaiton));
		document.getElementById('currentLat').innerHTML = location.latitude; 
		document.getElementById('currentLon').innerHTML = location.longitude; 
		console.log(location.latitude + ", " + location.longitude);
		localStorage.setItem("LastLatitude", localStorage.getItem("Latitude")); 
		localStorage.setItem("LastLongitude", localStorage.getItem("Longitude"));
		localStorage.setItem("Latitude", location.latitude);
		localStorage.setItem("Longitude", location.longitude);
		localStorage.setItem("timestamp", location.timestamp);
		console.log(location.timestamp);
		geocodeLatLng(geocoder, map, infowindow);
		sendData(); 

	}, function(err) { 
		console.log("Error: Didn't get an update", err); 
	}); 

	bgLocationServices.start(); 

	
	/* Begin Tracking is only called once and updates current locations while geocodeLatLng is called
	* every time we get a new location update and that updates the database table location_data but not
	*current locations */ 

	beginTracking(); /* server updates */ 

	//setInterval(getCurrentLocation, 60000); 


	/* hide all elements user shouldn't be able to access while tracking */ 
	$("#startTracking_start").removeClass("visible").addClass("hidden");
	$("#endTracking_end").removeClass("hidden").addClass("visible");
	$("#log_out").addClass("hidden"); 
	$("#location_data").removeClass("hidden").addClass("visible"); 

} 

/** 
 * Function: getCurrentLocation() 
 * 
 * Description: the startBackgroundGeolocation function only gets location updates in the background 
 * and sends them to the server by calling sendData(). This function is called on an interval when 
 * the app is open to get the current location and send it to the server.
 */ 
 /* 
function getCurrentLocation() { 
		navigator.geolocation.getCurrentPosition(

			function(position) {
				document.getElementById('currentLat').innerHTML = position.coords.latitude;
            	document.getElementById('currentLon').innerHTML = position.coords.longitude;
            	//initMap(position.coords.latitude, position.coords.longitude);
            	console.log("got position");
            	localStorage.setItem("Latitude", position.coords.latitude);
            	localStorage.setItem("Longitude", position.coords.longitude);

            	var myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude};
            	            	
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
            	});
        	},
         
        	// Error
        	function(error){
            	console.log(error);
        	},
         
        	// Settings
        	{enableHighAccuracy: true }); 
} 
*/ 
function stopBackgroundGeolocation() { 
	//alert("stopping background location services");
	/* update tracking status */ 
	sessionStorage.setItem("tracking_status", 0); 
	console.log("stopping background geolocation tracking");
	/* stop background geolocation services */ 
	bgLocationServices.stop();
    bgLocationServices = null;
    document.getElementById('tracking_status').innerHTML = "Inactive";
    $("#startTracking_start").removeClass("hidden").addClass("visible");
    $("#endTracking_end").removeClass("visible").addClass("hidden");
	$("#log_out").removeClass("hidden").addClass("visible"); 
	endTracking(); /* server updates */ 

}
/*  
 * Function: loadCheckIn() 
 *  
 * Description: Hides the map and check in button and displays the check in form
 */ 

function loadCheckIn() {
	document.getElementById("map").className = "hidden"; 
	document.getElementById("check_in_btn").className = "hidden"; 
	var form = document.getElementById("checkin_form"); 
	form.className = "visible"; 
}


$("#feedback_form").submit(function(event) { 
	//stop from handling the form normally 
	event.preventDefault(); 
	//now get some values from elements on the page
	//submitCheckIn(); //--> this function is in tracker.js 
	//returnFromCheckIn(); 
}); 



/** 
 * Funcion: returnFromCheckIn() 
 * 
 * Description: when the user clicks cancel, the application hides the check in form and reloads the map
 */ 
function returnFromCheckIn() { 
	var form = document.getElementById("checkin_form"); 
    form.className = "hidden"; 
    document.getElementById("map").className = "visible"; 
    document.getElementById("check_in_btn").className = "visible button button-positive"; 

}

/** 
 * Function: logOut() 
 * 
 * Description: clears the data in local storage and session storage and logs the user out 
 */ 

function logOut() {
	console.log("logging user out"); 
	/* clear persistent storage */ 
	sessionStorage.clear(); 
	localStorage.clear(); 
	window.location = "index.html"; 
} 
