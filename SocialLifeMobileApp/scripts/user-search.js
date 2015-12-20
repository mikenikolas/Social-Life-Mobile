(function (global) {
    var UsersViewModel,
    app = global.app = global.app || {};

    UsersViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        areUsersFound: false,
        areUsersSearched: false,
        search: "",
        users: [],

        init: function () {
            var that = this;
            
            kendo.data.ObservableObject.fn.init.apply(that, []);
        },
        
        onLoad: function () {
            var that = global.app.userService.viewModel;
            that.set("isLoggedIn", global.app.isLoggedIn);
        },
        
        onSearch: function () {
            var that = global.app.userService.viewModel;
            
            if (global.app.sessionKey != "" && global.app.sessionKey != undefined) {
                httpRequest.getJSON(global.app.serviceUrl + global.app.profiles + "search?username=" + that.search
                                    + "&sessionKey=" + global.app.sessionKey)
                .then(function (users) {
                    that.set("areUsersSearched", true);
                    if (users.length != 0) {
                        that.set("areUsersFound", true);
                        that.set("users", users);
                    }
                    else {
                        that.set("areUsersFound", false);
                    }
                });
            }
        },
        
        navigateToUser: function (e) {
            global.app.application.navigate("views/profile-view.html#profile-view?userId=" + e.data.Id, 'slide:left');
        },
    });

    app.userService = {
        viewModel: new UsersViewModel(),
    };
})(window);