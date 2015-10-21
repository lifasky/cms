"use strict";

var app = require("express")();
app.set("port", 9000);

var wholeMill = require("./lib")(app);

// app.get("/admin/editor", function(req, res) {
//   res.render("editor");
// });

var server = app.listen(app.get("port"));
console.log("Server listening on port " + app.get("port"));
