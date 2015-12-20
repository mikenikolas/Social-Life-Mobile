(function (global) {
    var EventSearchViewModel,
    app = global.app = global.app || {};

    EventSearchViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        areEventsFound: false,
        areEventsSearched: false,
        search: "",
        events: [],

        init: function () {
            var that = this;
            
            kendo.data.ObservableObject.fn.init.apply(that, []);
        },
        
        onLoad: function () {
            var that = global.app.eventSearchService.viewModel;
            that.set("isLoggedIn", global.app.isLoggedIn);
        },
        
        onSearch: function () {
            var that = global.app.eventSearchService.viewModel;
            
            if (global.app.sessionKey != "" && global.app.sessionKey != undefined) {
                httpRequest.getJSON(global.app.serviceUrl + global.app.events + "search?name=" + that.search
                                    + "&sessionKey=" + global.app.sessionKey)
                .then(function (events) {
                    that.set("areEventsSearched", true);
                    if (events.length != 0) {
                        that.set("areEventsFound", true);
                        that.set("events", events);
                        var x = 5;
                    }
                    else {
                        that.set("areEventsFound", false);
                    }
                });
            }
        },
        
        navigateToEvent: function (e) {
            global.app.application.navigate("views/event-view.html#event-view?eventId=" + e.data.EventId, 'slide:left');
        },
    });

    app.eventSearchService = {
        viewModel: new EventSearchViewModel(),
    };
})(window);