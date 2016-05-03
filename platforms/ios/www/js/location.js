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

	/*
	myOptions = {
		zoom:10,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: mapCenter,
	};
     */          
	console.log("Got position and initializing map"); 
	/* initialize maps */ 
	//map = new google.maps.Map(document.getElementById("map"), myOptions),
    map = new google.maps.Map(document.getElementById("map"), {
		zoom:10,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: mapCenter
	});
             
	marker = new google.maps.Marker({
		position: new google.maps.LatLng(lat, longi),
   		map: map,
    	title:"Current Location!"
    })
}

/** Failure callback for getCurrentPosition **/ 
function showError(error){
	alert("Getting the error: " + error);
	console.log("Error: " + error); 
}


function startBackgroundGeolocation() { 


	navigator.geolocation.getCurrentPosition(showPosition, showError, {enableHighAccuracy:true}); 

	console.log("starting background geolocation tracking");
	alert("starting background geolocation");
	document.getElementById('tracking_status').innerHTML = "Active"; 
	/* set tracking status to 1 */ 
	sessionStorage.setItem("tracking_status", 1);

	bgLocationServices = window.plugins.backgroundLocationServices;
		/*Confgiure bgLocationServices*/ 	
		bgLocationServices.configure({ 
			desiredAccuracy: 20, // Desired Accuracy of the location updates (lower means more accurate but more battery consumption)
     		distanceFilter: 5, // (Meters) How far you must move from the last point to trigger a location update
     		debug: true, // <-- Enable to show visual indications when you receive a background location update
     		interval: 9000, // (Milliseconds) Requested Interval in between location updates.
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
		console.log("We got a BG update" + JSON.stringify(location)); 
		document.getElementById('currentLat').innerHTML = location.latitude; 
		document.getElementById('currentLon').innerHTML = location.longitude; 
		console.log(location.latitude + ", " + location.longitude);
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
	beginTracking(); /* server updates */ 


	/* hide all elements user shouldn't be able to access while tracking */ 
	$("#startTracking_start").removeClass("visible").addClass("hidden");
	$("#endTracking_end").removeClass("hidden").addClass("visible");
	$("#log_out").addClass("hidden"); 
	$("#location_data").removeClass("hidden").addClass("visible"); 

} 

function stopBackgroundGeolocation() { 
	alert("stopping background location services");
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
	submitCheckIn(); //--> this function is in tracker.js 
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
