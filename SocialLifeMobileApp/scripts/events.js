(function (global) {
    var EventViewModel,
    app = global.app = global.app || {};

    EventViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        isAttending: false,
        isEventFound: false,
        isLocationChosen: false,
        eventId: 0,
        eventName: "",
        avatar: "",
        content: "",
        users: [],
        creator: "",
        date: "",
        status: "",
        longitude: "",
        latitude: "",

        init: function () {
            var that = this;

            kendo.data.ObservableObject.fn.init.apply(that, []);
        },
        
        onLoad: function (e) {
            var that = global.app.eventService.viewModel;
            that.set("isLoggedIn", global.app.isLoggedIn);
            
            var eventId = e.view.params.eventId;
            
            if (eventId != "" && eventId != undefined) {
                that.onGetEventInfo(eventId);
            }
            else if (!that.isLocationChosen) {
                that.set("eventId", "");
                that.set("isEventFound", false);
                that.set("eventName", "");
                that.set("content", "");
                that.set("creator", "");
                that.set("users", "");
                that.set("date", "");
                that.set("status", "");
                that.set("longitude", "");
                that.set("latitude", "");
            }
        },
        
        onGetEventInfo: function (eventId) {
            var that = global.app.eventService.viewModel;
            
            if (global.app.sessionKey != "" && global.app.sessionKey != undefined) {
                httpRequest.getJSON(global.app.serviceUrl + global.app.events + "get/" + eventId
                                    + "?sessionKey=" + global.app.sessionKey)
                .then(function (event) {
                    that.set("eventId", eventId);
                    that.set("eventName", event.Name);
                    that.set("content", event.Content);
                    if (event.AvatarUrl != "") {
                        that.set("avatar", event.AvatarUrl);
                    }
                    else {
                        that.set("avatar", "http://i.imgur.com/vlXriy0.png");
                    }
                    that.set("creator", event.CreatorName);
                    that.set("users", event.UsersList);
                    //var dateString = new Date(event.Date).toDateString();
                    that.set("date", event.Date);
                    that.set("status", event.Status);
                    that.set("latitude", event.Latitude);
                    that.set("longitude", event.Longitude);
                    
                    var usersLen = that.users.length;
                    
                    if (usersLen > 0) {
                        for (var i = 0; i < usersLen; i++) {
                            if (that.users[i].DisplayName == global.app.displayName) {
                                that.set("isAttending", true)
                            }
                        }
                    }
                    that.set("isEventFound", true);
                    kendo.bind($("#update-event-btn"), app.eventService.viewModel);
                });
            }
        },
        
        onAttendButton: function () {
            var that = global.app.eventService.viewModel;
            
            httpRequest.putJSON(global.app.serviceUrl + global.app.events + "add/" + 
                                that.eventId + "?sessionKey=" + global.app.sessionKey + "&userId=0")
            .then(function (data) {
                that.set("isAttending", true);
                
                that.onGetEventInfo(that.eventId);
            });
        },
        
        onNotAttendButton: function () {
            var that = global.app.eventService.viewModel;
            
            if (that.creator == global.app.displayName) {
                navigator.notification.confirm(
                    'You are the creator. Do you want to delete this event?', // message
                    function(chosenAction) {
                        if (chosenAction == 1) {
                            that.onDeleteEvent();
                        }  
                    },
                    'Delete event',
                    ['Yes','No']
                    );
            }
            else {
                httpRequest.putJSON(global.app.serviceUrl + global.app.events + "remove/" + 
                                    that.eventId + "?sessionKey=" + global.app.sessionKey + "&userId=" + global.app.userId)
                .then(function (data) {
                    that.set("isAttending", false);
                
                    that.onGetEventInfo(that.eventId);
                });
            }
        },
        
        onSeeMessages: function () {
            global.app.application.navigate("views/messages-view.html#messages-view?eventId=" + this.eventId, 'slide:left');
        },
        
        onSeeUsers: function () {
            global.app.application.navigate("views/lists-view.html#lists-view?type=" + "2", 'slide:left');
        },
        
        navigateToUser: function () {
        },
        
        onUpdateEvent: function () {
            if (this.creator == global.app.displayName) {
                global.app.application.navigate("views/edit-event-view.html#event-edit?eventId=" + this.eventId, 'slide:left');
            }
            else {
                navigator.notification.alert("You have to be the creator of the event if you want to update!",
                                             function () {
                                             }, "Update failed", 'OK');

                return;
            }
        },
        
        onSubmitEventData: function () {
            var that = global.app.eventService.viewModel;
            
            var status = $('input[name=status-radio]:checked', '#event-form').val();
            var dateString = $('#update-date').val().toString(); //new Date(); //
            
            //LOCATION!!!!
            var longitude = that.get("longitude");
            var latitude = that.get("latitude");
            
            if (longitude == "" || latitude == "") {
                latitude = "42.694359";
                longitude = "23.331614";
            }
            var contentInfo = {
                "Content": that.content, "AvatarUrl": that.avatar, 
                "Name": that.eventName, "Status": status, "Date": dateString, 
                "Longitude": longitude, "Latitude": latitude
            };
            
            var contentJSON = JSON.stringify(contentInfo);
            
            var serviceUrl = "";
            if (that.eventId != "") {
                serviceUrl = global.app.serviceUrl + global.app.events + "update/" + 
                             that.eventId + "?sessionKey=" + global.app.sessionKey;
                that.onUpdateEventQuery(serviceUrl, contentJSON);
            }
            else {
                serviceUrl = global.app.serviceUrl + global.app.events + "create" + 
                             "?sessionKey=" + global.app.sessionKey;
                that.onCreateEventQuery(serviceUrl, contentJSON);
            }
        },
        
        onUpdateEventQuery: function(serviceUrl, contentJSON) {
            var that = global.app.eventService.viewModel;
            
            httpRequest.putJSON(serviceUrl, contentJSON)
            .then(function (event) {
                that.set("isLocationChosen", false);
                global.app.application.navigate("views/event-view.html#event-view?eventId=" + that.eventId, 'slide:left');
            });
        },
        
        onCreateEventQuery: function(serviceUrl, contentJSON) {
            var that = global.app.eventService.viewModel;
            
            httpRequest.postJSON(serviceUrl, contentJSON)
            .then(function (event) {
                that.set("isLocationChosen", false);
                global.app.application.navigate("views/event-view.html#event-view?eventId=" + event.EventId, 'slide:left');
            });
        },
        
        onDeleteEvent: function() {
            var that = global.app.eventService.viewModel;
            
            httpRequest.deleteNoJSON(global.app.serviceUrl + global.app.events + "delete/" + 
                                     that.eventId + "?sessionKey=" + global.app.sessionKey)
            .then(function(a) {
                global.app.application.navigate("views/profile-view.html#profile-view", 'slide:left');
            });
        },
        
        takePicture: function () {
            var that = global.app.eventService.viewModel;
            //global.app.application.
            navigator.camera.getPicture(that.changeAvatar, that.takePictureFail, {
                quality: 50,
                targetWidth: 100,
                targetHeight: 100,
                destinationType : Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                targetWidth : 200,
                targetHeight : 200
            }); 
        },
        
        choosePicture: function () {
            var that = global.app.eventService.viewModel;
            navigator.camera.getPicture(that.changeAvatar, that.takePictureFail, {
                quality: 50,
                targetWidth: 100,
                targetHeight: 100,
                destinationType : Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                MediaType: Camera.MediaType.PICTURE
            }); 
        },
        
        changeAvatar: function changeAvatar(image) {
            var imageData = {"image": image, "type": "base64" };
            
            var imageJSON = JSON.stringify(imageData);
            
            var imgurService = "https://api.imgur.com/3/image";
            
            httpRequest.postImage(imgurService, imageJSON)
            .then(function (data) {
                var that = global.app.eventService.viewModel;
                
                that.set("avatar", data.data.link);
            });
        },
        
        takePictureFail: function takePictureFail(message) {
            alert('Failed because: ' + message);
        },
        
        checkEnter: function (e) {
            var that = this;

            if (e.keyCode == 13) {
                $(e.target).blur();
                that.onLogin();
            }
        },
        
        onChooseLocation: function() {
            var that = global.app.eventService.viewModel;
            that.set("latitude", "");
            that.set("longitude", "");
            global.app.application.navigate("views/map-view.html#location-view", 'slide:left');
        },
        
        onSeeLocation: function() {
            global.app.application.navigate("views/map-view.html#location-view", 'slide:left');
        }
    });

    app.eventService = {
        viewModel: new EventViewModel(),
    };
})(window);