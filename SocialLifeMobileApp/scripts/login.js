(function (global) {
    var LoginViewModel,
    app = global.app = global.app || {};

    LoginViewModel = kendo.data.ObservableObject.extend({
        isRegisterPressed: false,
        isLoggedIn: global.app.isLoggedIn,
        username: "",
        password: "",
        displayName: "",
        passwordRepeat: "",
        profile: {},

        onLogin: function () {
            var that = this,
            username = that.get("username").trim(),
            password = that.get("password").trim();
            
            if (username === "" || password === "") {
                navigator.notification.alert("Both fields are required!",
                                             function () {
                                             }, "Login failed", 'OK');

                return;
            }
            
            var shaPassword = CryptoJS.SHA1(that.password);
            
            var passToSha = shaPassword.toString();
            
            var loginInfo = {"Username": that.username, "AuthCode": passToSha};
            
            var jsonData = JSON.stringify(loginInfo);
            
            httpRequest.postJSON(global.app.serviceUrl + global.app.users + "login", jsonData)
            .then(function (data) {
                global.app.sessionKey = data.SessionKey;
                global.app.userId = data.Id;
                global.app.displayName = data.DisplayName;
                that.set("isRegisterPressed", false);
                that.onLoginSuccess("login");
            });
        },
        
        onRegister: function () {
            if (this.isRegisterPressed) {
                var that = this,
                username = that.get("username").trim(),
                password = that.get("password").trim(),
                passwordRepeat = that.get("passwordRepeat").trim(),
                displayName = that.get("displayName").trim();

                if (username === "" 
                    || password === "" 
                    || displayName === ""
                    || passwordRepeat != password) {
                    navigator.notification.alert("All fields are required and passwords must match!",
                                                 function () {
                                                 }, "Registration failed", 'OK');

                    return;
                }
                
                if (username.length < 6 || password.length < 6) {
                    navigator.notification.alert("Username & passwords must have at least 6 symbols." +
                                                 "\nValid username characters: letters, numbers and dot.",
                                                 function () {
                                                 }, "Registration failed", 'OK');

                    return;
                }
                
                var shaPassword = CryptoJS.SHA1(that.password);
                
                var passToSha = shaPassword.toString();
            
                var loginInfo = {"Username": that.username, "AuthCode": passToSha, "DisplayName": that.displayName};
            
                var jsonData = JSON.stringify(loginInfo);
            
                httpRequest.postJSON(global.app.serviceUrl + global.app.users + "register", jsonData)
                .then(function (data) {
                    global.app.sessionKey = data.SessionKey;
                    
                    global.app.userId = data.Id;
                    
                    global.app.displayName = data.DisplayName;
                    
                    that.set("isRegisterPressed", false);
                    
                    that.onLoginSuccess("register");
                });
            }
            else {
                this.set("isRegisterPressed", true);
            }
        },

        onLogout: function () {
            var that = this;

            that.clearForm();
            global.app.isLoggedIn = false;
            that.set("isLoggedIn", false);
            global.app.sessionKey = "";
            global.app.userId = "";
            global.app.displayName = "";
            global.app.userFriends = "";
            that.set("profile", {});
        },
        
        onLoginSuccess: function(type) {
            var that = this;
            
            //IF just registered!
            if (type == "register") {
                global.app.isLoggedIn = true;
                that.set("isLoggedIn", true);
                global.app.userFriends = "";
                global.app.application.navigate("views/update-profile-view.html#profile-update", 'slide:left');
            }
            else {
                httpRequest.getJSON(global.app.serviceUrl + global.app.profiles + "user/" + global.app.userId
                                    + "?sessionKey=" + global.app.sessionKey)
                .then(function (user) {
                    var userProfile = {
                        "displayName": user.DisplayName,
                        "about": user.About,
                        "avatar": user.Avatar,
                        "birthdate": user.BirthDate,
                        "city": user.City,
                        "country": user.Country,
                        "gender": user.Gender,
                        "mood": user.Mood,
                        "status": user.Status,
                        "phone": user.PhoneNumber,
                        "friends": user.FriendsList
                    };
                    that.set("profile", userProfile);
                    
                    var friendsLength = that.profile.friends.length;
                    
                    if (friendsLength == 0) {
                        global.app.userFriends = "";
                    }
                    else {
                        for (var i = 0; i < friendsLength; i++) {
                            if (global.app.userFriends == undefined || global.app.userFriends == "") {
                                global.app.userFriends = that.profile.friends[i].Id.toString();
                            }
                            else {
                                global.app.userFriends = global.app.userFriends + ' ' + that.profile.friends[i].Id;
                            }
                        }
                    }
                    
                    global.app.isLoggedIn = true;
                    that.set("isLoggedIn", true);
                });
            }
        },

        clearForm: function () {
            var that = this;

            that.set("username", "");
            that.set("password", "");
            that.set("displayName", "");
        },

        checkEnter: function (e) {
            var that = this;

            if (e.keyCode == 13) {
                $(e.target).blur();
                that.onLogin();
            }
        }
    });

    app.loginService = {
        viewModel: new LoginViewModel()
    };
})(window);