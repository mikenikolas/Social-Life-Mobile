(function (global) {
    app = global.app = global.app || {},
    os = kendo.support.mobileOS,
    statusBarStyle = os.ios && os.flatVersion >= 700 ? "black-translucent" : "black";

    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
        var networkState = navigator.network.connection.type;
        if (networkState == "2g" || networkState == "3g") {
            navigator.notification.vibrate(100);
            navigator.notification.alert("Be careful, this app can drain a lot of data. Try switching to a wi-fi connection");
        }
    }, false);

    app.application = new kendo.mobile.Application(document.body, 
                                                   {
                                                       layout: "default-layout", 
                                                       statusBarStyle: statusBarStyle,
                                                       skin: "flat",
                                                   });
    
    document.addEventListener("offline", onOffline, false);
   
    app.sessionKey = "";
    app.userId = "";
    app.displayName = "";
    app.userFriends = "";
    app.serviceUrl = "http://sociallife.apphb.com/api/";
    app.users = "users/";
    app.profiles = "profiles/";
    app.messages = "messages/";
    app.events = "events/";
    app.isLoggedIn = false;
           
    //wake up appharbor
    httpRequest.getJSON(app.serviceUrl + "wake/wake")
    .then(function() { 
        return; 
    });
    
    function onOffline() {
        navigator.notification.vibrate(300);
        navigator.notification.alert("You need a connection to use this app.", function() {
            navigator.app.exitApp();
        }, "No connection", "Exit");
    }
})(window);