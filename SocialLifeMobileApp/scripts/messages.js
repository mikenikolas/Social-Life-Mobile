(function (global) {
    var MessagesViewModel,
    app = global.app = global.app || {};

    MessagesViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        areMessagesReceived: false,
        isEventMessages: false,
        otherUser: "",
        userEventId: "",
        messages: [],
        messageToSend: "",

        init: function () {
            var that = this;
            
            kendo.data.ObservableObject.fn.init.apply(that, []);
        },
        
        onLoad: function (e) {
            var that = global.app.messagesService.viewModel;
            that.set("isLoggedIn", global.app.isLoggedIn);
            
            var userId = e.view.params.userId;
            if (userId != "" && userId != undefined) {
                that.set("isEventMessages", false);
                that.set("userEventId", userId);
                that.onGetUserMessages(userId);
            }
            else {
                var eventId = e.view.params.eventId;
                if (eventId != "" && eventId != undefined) {
                    that.set("isEventMessages", true);
                    that.set("userEventId", eventId);
                    that.onGetEventMessages(eventId);
                }
            }
        },
        
        onGetUserMessages: function (userId) {
            var that = global.app.messagesService.viewModel;
            //var ttt = global.app.profileService.viewModel;
            if (global.app.sessionKey != "" && global.app.sessionKey != undefined) {
                httpRequest.getJSON(global.app.serviceUrl + global.app.messages + "getpm/" + userId +
                                    "?sessionKey=" + global.app.sessionKey)
                .then(function (messages) {
                    if (messages.length != 0) {
                        that.set("areMessagesReceived", true);
                        that.set("messages", messages);
                        if (messages[0].Sender == global.app.displayName) {
                            that.set("otherUser", messages[0].Receiver);
                        }
                        else {
                            that.set("otherUser", messages[0].Sender);
                        }
                        //$('.km-scroll-wrapper').scrollTo($('#messages'), 0);
                    }
                });
            }
        },
        
        onSendMessage: function() {
            var that = global.app.messagesService.viewModel;
            
            if (that.messageToSend === "") {
                navigator.notification.alert("Can't send empty message!",
                                             function () {
                                             }, "Login failed", 'OK');

                return;
            }
            
            var dateNow = new Date();
            var date = dateNow.toLocaleDateString() + " " + dateNow.toLocaleTimeString();
            var messageInfo = {};
            var url = "";
            if (that.isEventMessages) {
                messageInfo = {
                    Content: that.messageToSend,
                    Date: date,
                    EventId: that.userEventId
                };
                url = "postevent";
            }
            else {
                messageInfo = {
                    Content: that.messageToSend,
                    Date: date,
                    ReceiverId: that.userEventId
                };
                url = "postpm";
            }
            
            var msgJSON = JSON.stringify(messageInfo);
            
            httpRequest.postJSON(global.app.serviceUrl + global.app.messages + url +
                                 "?sessionKey=" + global.app.sessionKey, msgJSON)
            .then(function (data) {
                that.set("messageToSend", "");
                if (that.isEventMessages) {
                    that.onGetEventMessages(that.userEventId);
                }
                else {
                    that.onGetUserMessages(that.userEventId);
                }
            });
        },
        
        onGetEventMessages: function(eventId) {
            var that = global.app.messagesService.viewModel;
            if (global.app.sessionKey != "" && global.app.sessionKey != undefined) {
                httpRequest.getJSON(global.app.serviceUrl + global.app.messages + "getevent/" + eventId +
                                    "?sessionKey=" + global.app.sessionKey)
                .then(function (messages) {
                    if (messages.length != 0) {
                        that.set("isEventMessages", true);
                        that.set("areMessagesReceived", true);
                        that.set("messages", messages);
                        that.set("otherUser", messages[0].Event);
                        //$('.km-scroll-wrapper').scrollTo($('#messages'), 0);
                    }
                    else {
                        that.set("isEventMessages", true);
                        that.set("messages", []);
                        that.set("areMessagesReceived", false);
                        that.set("otherUser", messages[0].Event);
                    }
                });
            }
        },
        
        onSendFriendMessage: function() {
            var that = global.app.messagesService.viewModel;
            
            if (that.messageToSend === "") {
                navigator.notification.alert("Can't send empty message!",
                                             function () {
                                             }, "Login failed", 'OK');

                return;
            }
            
            var dateNow = new Date();
            var date = dateNow.toLocaleDateString() + " " + dateNow.toLocaleTimeString();
            var messageInfo = {};
            var url = "free";
            
            messageInfo = {
                    Content: that.messageToSend,
                    Date: date
                };
            
            var msgJSON = JSON.stringify(messageInfo);
            
            httpRequest.postJSON(global.app.serviceUrl + global.app.messages + url +
                                 "?sessionKey=" + global.app.sessionKey, msgJSON)
            .then(function (data) {
                that.set("messageToSend", "");
                navigator.notification.alert(data,
                                             function () {
                                             }, "Messages sent", 'OK');
                global.app.application.navigate("#:back");
            });
        }
    });

    app.messagesService = {
        viewModel: new MessagesViewModel(),
    };
})(window);