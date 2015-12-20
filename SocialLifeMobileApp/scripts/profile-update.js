(function (global) {
    var ProfileViewModel,
    app = global.app = global.app || {};

    ProfileViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        isOtherUser: true,
        isOtherUserFriend: false,
        areEventsFound: false,
        isLocationFound: false,
        userId: "",
        displayName: "",
        about: "",
        avatar: "",
        birthdate: "",
        city: "",
        country: "",
        gender: "",
        mood: "",
        status: "",
        phone: "",
        friends: [],
        password: "",
        latitude: "",
        longitude: "",
        locationDate: "",

        init: function () {
            var that = this;

            kendo.data.ObservableObject.fn.init.apply(that, []);
        },
        
        onLoad: function (e) {
            var that = global.app.profileService.viewModel;
            that.set("isLoggedIn", global.app.isLoggedIn);
            
            var userId = e.view.params.userId;
            
            if (userId == undefined) {
                userId = global.app.userId;
                that.set("isOtherUser", false);
            }
            else {
                that.set("isOtherUser", true);
                
                var userFriends = global.app.userFriends.toString().split(" ");
                var friendsLen = userFriends.length;
                
                for (var i = 0; i < friendsLen; i++) {
                    if (userFriends[i] == userId) {
                        that.set("isOtherUserFriend", true);
                    }
                }
            }
            
            if (global.app.sessionKey != "" && global.app.sessionKey != undefined) {
                httpRequest.getJSON(global.app.serviceUrl + global.app.profiles + "user/" + userId
                                    + "?sessionKey=" + global.app.sessionKey)
                .then(function (user) {
                    that.set("userId", user.UserId);
                    that.set("displayName", user.DisplayName);
                    
                    //if about is missing, set some text
                    if (user.About != "" && user.About != null) {
                        that.set("about", user.About);
                    }
                    else {
                        that.set("about", "Not set");
                    }
                    
                    if (user.Avatar != null) {
                        that.set("avatar", user.Avatar);
                    }
                    else {
                        that.set("avatar", "http://i.imgur.com/vlXriy0.png");
                    }
                    
                    //if date info is missing, set some text
                    var dateString = user.BirthDate.toString();
                    if (dateString != "" && dateString != null) {
                        that.set("birthdate", dateString);
                    }
                    else {
                        that.set("birthdate", "Not set");
                    }
                    
                    //if city info is missing, set some text
                    if (user.City != "" && user.City != null) {
                        that.set("city", user.City);
                    }
                    else {
                        that.set("city", "Not set");
                    }
                    
                    //if country info is missing, set some text
                    if (user.Country != "" && user.Country != null) {
                        that.set("country", user.Country);
                    }
                    else {
                        that.set("country", "Not set");
                    }
                    
                    if (user.Gender == true) {
                        that.set("gender", "Male");
                    }
                    else {
                        that.set("gender", "Female");
                    }
                    
                    //if mood info is missing, set some text
                    if (user.Mood != "" && user.Mood != null) {
                        that.set("mood", user.Mood);
                    }
                    else {
                        that.set("mood", "Not set");
                    }
                    
                    that.set("status", user.Status);
                    
                    //if phone info is missing, set some text
                    if (user.PhoneNumber != "" && user.Mood != null) {
                        that.set("phone", user.PhoneNumber);
                    }
                    else {
                        that.set("phone", "Not set");
                    }
                    that.set("friends", user.FriendsList);
                    
                    if (user.EventsCount > 0) {
                        that.set("areEventsFound", true);
                    }
                    else {
                        that.set("areEventsFound", false);
                    }
                    
                    if (user.LastLatitude != "" && user.LastLongitute != "") {
                        that.set("isLocationFound", true);
                        that.set("latitude", user.LastLatitude);
                        that.set("longitude", user.LastLongitute);
                        that.set("locationDate", user.LastLocationDate);
                    }
                    else {
                        that.set("isLocationFound", false);
                        that.set("latitude", "");
                        that.set("longitude", "");
                    }
                });
            }
        },
        
        takePicture: function () {
            var that = global.app.profileService.viewModel;
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
            var that = global.app.profileService.viewModel;
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
                var that = global.app.profileService.viewModel;
                
                that.set("avatar", data.data.link);
            });
        },
        
        takePictureFail: function takePictureFail(message) {
            alert('Failed because: ' + message);
        },
        
        onUpdate: function () {
            var that = global.app.profileService.viewModel,
            password = that.get("password"),
            displayName = that.get("displayName"),
            about = that.get("about"),
            avatar = that.get("avatar"),
            birthdate = $("#update-birth").val().toString(),
            city = that.get("city"),
            country = that.get("country"),
            gender = $('input[name=gender-radio]:checked', '#update-form').val(),
            mood = that.get("mood"),
            status = $('input[name=status-radio]:checked', '#update-form').val(),
            phone = that.get("phone");
            
            if (password === "") {
                navigator.notification.alert("Please enter your password!",
                                             function () {
                                             }, "Update failed", 'OK');

                return;
            }
            
            if (gender == "Male") {
                gender = "true";
            }
            else if (gender == "Female") {
                gender = "false";
            }
            
            var data = {
                "About": about,
                "Avatar": avatar,
                "BirthDate": birthdate,
                "City": city,
                "Country": country,
                "Gender": gender,
                "Mood": mood,
                "Status": status,
                "PhoneNumber": phone,
                "AuthCode": CryptoJS.SHA1(password).toString(),
                "DisplayName": displayName
            };
            
            var jsonData = JSON.stringify(data);
            
            httpRequest.putJSON(global.app.serviceUrl + global.app.profiles + "update?sessionKey=" + global.app.sessionKey, jsonData)
            .then(function (data) {
                global.app.application.navigate("#:back");
            });
        },
        
        onAddAsFriend: function () {
            var that = global.app.profileService.viewModel;
            
            httpRequest.putJSON(global.app.serviceUrl + global.app.profiles + "add/" + 
                                that.userId + "?sessionKey=" + global.app.sessionKey)
            .then(function (data) {
                that.set("isOtherUserFriend", true);
                
                var friendsString = global.app.userFriends;
                if (friendsString == "") {
                    friendsString = that.userId.toString();
                }
                else {
                    friendsString = friendsString + ' ' + that.userId.toString();
                }
                
                global.app.userFriends = friendsString;
            });
        },
        
        onRemoveFriend: function () {
            var that = global.app.profileService.viewModel;
            
            httpRequest.putJSON(global.app.serviceUrl + global.app.profiles + "remove/" + 
                                that.userId + "?sessionKey=" + global.app.sessionKey)
            .then(function (data) {
                that.set("isOtherUserFriend", false);
                
                var userFriends = global.app.userFriends.toString().split(" ");
                var friendsLen = userFriends.length;
                global.app.userFriends = "";
                for (var i = 0; i < friendsLen; i++) {
                    if (userFriends[i] != that.userId) {
                        if (global.app.userFriends == undefined || global.app.userFriends == "") {
                            global.app.userFriends = userFriends[i].toString();
                        }
                        else {
                            global.app.userFriends = global.app.userFriend + ' ' + userFriends[i].Id.toString();
                        }
                    }
                }
            });
        },
        
        onOpenMessages: function () {
            global.app.application.navigate("views/messages-view.html#messages-view?userId=" + this.userId, 'slide:left');
        },
        
        onSeeFriends: function () {
            global.app.application.navigate("views/lists-view.html#lists-view?type=" + "1", 'slide:left');
        },
        
        onSeeEvents: function () {
            global.app.application.navigate("views/lists-view.html#lists-view?type=" + "0", 'slide:left');
        },
        
        onSeeLocation: function() {
            global.app.application.navigate("views/map-view.html#location-view", 'slide:left');
        },
        
        onShareLocation: function() {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    httpRequest.postNoJSON(global.app.serviceUrl + global.app.profiles + "location?" 
                                           + "latitude=" + position.coords.latitude 
                                           + "&longitude=" + position.coords.longitude
                                           + "&sessionKey=" + global.app.sessionKey)
                    .then(function (data) {
                        var that = global.app.profileService.viewModel;
                        that.set("isLocationFound", true);
                        that.set("latitude", position.coords.latitude);
                        that.set("longitude", position.coords.longitude);
                        that.set("locationDate", new Date().toDateString());
                    });
                },
                function (error) {
                    navigator.notification.alert("Unable to determine current location. Cannot connect to GPS satellite.",
                                                 function () {
                                                 }, "Location failed", 'OK');
                },
                {
                timeout: 30000,
                enableHighAccuracy: false
            });
        },
        
        checkEnter: function (e) {
            var that = this;

            if (e.keyCode == 13) {
                $(e.target).blur();
                that.onLogin();
            }
        }
    });

    app.profileService = {
        viewModel: new ProfileViewModel(),
    };
})(window);