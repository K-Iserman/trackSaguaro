cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-geolocation/www/Coordinates.js",
        "id": "cordova-plugin-geolocation.Coordinates",
        "clobbers": [
            "Coordinates"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
        "id": "cordova-plugin-geolocation.PositionError",
        "clobbers": [
            "PositionError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/Position.js",
        "id": "cordova-plugin-geolocation.Position",
        "clobbers": [
            "Position"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/geolocation.js",
        "id": "cordova-plugin-geolocation.geolocation",
        "clobbers": [
            "navigator.geolocation"
        ]
    },
    {
        "file": "plugins/cordova-plugin-background-fetch/www/BackgroundFetch.js",
        "id": "cordova-plugin-background-fetch.BackgroundFetch",
        "clobbers": [
            "window.BackgroundFetch"
        ]
    },
    {
        "file": "plugins/com.transistorsoft.cordova.background-geolocation/www/BackgroundGeolocation.js",
        "id": "com.transistorsoft.cordova.background-geolocation.BackgroundGeolocation",
        "clobbers": [
            "window.BackgroundGeolocation"
        ]
    },
    {
        "file": "plugins/org.flybuy.cordova.background-location-services/www/BackgroundLocationServices.js",
        "id": "org.flybuy.cordova.background-location-services.BackgroundLocationServices",
        "clobbers": [
            "plugins.backgroundLocationServices"
        ]
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "id": "cordova-plugin-dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.2",
    "cordova-plugin-geolocation": "2.2.1-dev",
    "cordova-plugin-background-fetch": "3.0.3",
    "com.transistorsoft.cordova.background-geolocation": "1.5.1",
    "org.flybuy.cordova.background-location-services": "1.0.1",
    "cordova-plugin-compat": "1.0.0",
    "cordova-plugin-dialogs": "1.2.1"
}
// BOTTOM OF METADATA
});