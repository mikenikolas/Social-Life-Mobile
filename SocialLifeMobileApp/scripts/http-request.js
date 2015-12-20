window.httpRequest = (function() {
    function getJSON(url) {
        var promise = new RSVP.Promise(function(resolve, reject) {
            $.ajax({
                url:url,
                type:"GET",
                dataType:"json",
                contentType:"application/json",
                timeout:5000,
                success:function(data) {
                    resolve(data);
                },
                error:function(request, status, error) {
                    var errorMsg = JSON.parse(request.responseText);
                    navigator.notification.alert(errorMsg.Message + " " + errorMsg.ExceptionMessage,
                                                 function() {
                                                 }, "Get request failed.", 'OK');
                }
            });
        });
        return promise;
    }
    
    function postJSON(url, postdata) {
        var promise = new RSVP.Promise(function(resolve, reject) {
            $.ajax({
                url:url,
                type:"POST",
                data: postdata,
                dataType:"json",
                contentType:"application/json",
                timeout:5000,
                success:function(data) {
                    resolve(data);
                },
                error:function(request, status, error) {
                    var errorMsg = JSON.parse(request.responseText);
                    navigator.notification.alert(errorMsg.Message + " " + errorMsg.ExceptionMessage,
                                                 function() {
                                                 }, "Post request failed.", 'OK');
                }
            });
        });
        return promise;
    }
    
    function postNoJSON(url) {
        var promise = new RSVP.Promise(function(resolve, reject) {
            $.ajax({
                url:url,
                type:"POST",
                timeout:5000,
                success:function(data) {
                    resolve(data);
                },
                error:function(request, status, error) {
                    var errorMsg = JSON.parse(request.responseText);
                    navigator.notification.alert(errorMsg.Message + " " + errorMsg.ExceptionMessage,
                                                 function() {
                                                 }, "Post request failed.", 'OK');
                }
            });
        });
        return promise;
    }
    
    function putJSON(url, putdata) {
        var promise = new RSVP.Promise(function(resolve, reject) {
            $.ajax({
                url:url,
                type:"PUT",
                data: putdata,
                contentType:"application/json",
                timeout:5000,
                success:function(data) {
                    resolve(data);
                },
                error:function(request, status, error) {
                    var errorMsg = JSON.parse(request.responseText);
                    navigator.notification.alert(errorMsg.Message + " " + errorMsg.ExceptionMessage,
                                                 function() {
                                                 }, "Put request failed.", 'OK');
                }
            });
        });
        return promise;
    }
    
    function putNoJSON(url) {
        var promise = new RSVP.Promise(function(resolve, reject) {
            $.ajax({
                url:url,
                type:"PUT",
                contentType:"application/json",
                timeout:5000,
                success:function(data) {
                    resolve(data);
                },
                error:function(request, status, error) {
                    var errorMsg = JSON.parse(request.responseText);
                    navigator.notification.alert(errorMsg.Message + " " + errorMsg.ExceptionMessage,
                                                 function() {
                                                 }, "Put request failed.", 'OK');
                }
            });
        });
        return promise;
    }
    
    function postImage(url, postdata) {
        var promise = new RSVP.Promise(function(resolve, reject) {
            $.ajax({
                url:url,
                type:"POST",
                data: postdata,
                dataType:"json",
                headers: {
                    "Authorization": "Client-ID 9a95fd186abaafa"
                },
                contentType:"application/json",
                timeout:5000,
                success:function(data) {
                    resolve(data);
                },
                error:function(request, status, error) {
                    var errorMsg = JSON.parse(request.responseText);
                    navigator.notification.alert(errorMsg.Message + " " + errorMsg.ExceptionMessage,
                                                 function() {
                                                 }, "Post request failed.", 'OK');
                }
            });
        });
        return promise;
    }
    
    function deleteNoJSON(url) {
        var promise = new RSVP.Promise(function(resolve, reject) {
            $.ajax({
                url:url,
                type:"DELETE",
                timeout:5000,
                success:function(data) {
                    resolve(data);
                },
                error:function(request, status, error) {
                    var errorMsg = JSON.parse(request.responseText);
                    navigator.notification.alert(errorMsg.Message + " " + errorMsg.ExceptionMessage,
                                                 function() {
                                                 }, "Put request failed.", 'OK');
                }
            });
        });
        return promise;
    }
    
    return {
        getJSON:getJSON,
        postJSON:postJSON,
        postNoJSON:postNoJSON,
        putJSON:putJSON,
        putNoJSON: putNoJSON,
        postImage: postImage,
        deleteNoJSON: deleteNoJSON
    };    
}());