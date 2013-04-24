var http = require("http");
var path = require("path");

var exports = module.exports;

exports.init = function(socket)
{
    // on first connect, announce the server timestamp
    socket.emit("timestamp", {
        "timestamp": process.env.CLOUDCMS_APPSERVER_TIMESTAMP
    });
};

exports.library = function(socket, library)
{
    var addHandler = function(methodName)
    {
        socket.on(methodName + "Request", function(data) {

            var responseMethodName = methodName + "Response";
            if (data.responseMethodName) {
                responseMethodName = data.responseMethodName;
            }

            var method = library[methodName];
            if (method)
            {
                method(responseMethodName, socket, data);
            }
        });
    };

    // all methods from the "sockets" library implement command handlers
    for (var methodName in library)
    {
        if (library.hasOwnProperty(methodName) && typeof(library[methodName]) === "function")
        {
            addHandler(methodName);
        }
    }
};