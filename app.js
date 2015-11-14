"use strict";

var app = require("express")();
app.set("port", 9000);

require("./lib")(app);

var server = app.listen(app.get("port"));
console.log("Server listening on port " + app.get("port"));
