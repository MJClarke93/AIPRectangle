// Creates an express app object
const express = require("express");
const app = express();

// Allows parsing of URL-Encoded
const bodyparser = require("body-parser");
const urlencodedparser = bodyparser.urlencoded({extended: false});

// Used for counting requests
var count = 0;

// Sets the front-end to be handled by EJS
app.set("view engine", "ejs");

// Lets the .ejs see the external stylesheet
app.use("/views",express.static(__dirname+"/views"));

// Increments count when a request is recieved
app.use((req, res, next) => {
    count++;
    next();
});

// Responds to GET by displaying index.ejs
app.get("/", (req, res) => {
	console.log("#"+count+": GET request recieved for root.");
    res.render("index", {msg: "", height: "", width: ""});
});

// Responds to POST by calculating the area then sending the results to index.ejs and displaying it
app.post("/", urlencodedparser, (req, res) => {
	console.log("#"+count+": POST request recieved for root.");
	
    if (!req.body) {
        return res.sendStatus(400);
    }

    const height = req.body.height;
    const width = req.body.width;

    if (isNaN(height) || isNaN(width)) {
		console.log("Input was invalid.");
        res.render("index", {msg: "Invalid input.", height: "", width: ""});
    } else {
        const area = height * width;
		console.log("[Height: "+height+" x Width: "+width+"] = [Area: "+area+"]");
        res.render("index", {msg: "Area = " + area, height: height, width: width});
    }
});

// Responds to non-root addresses with a 404
app.all("*", (req, res) => {
	console.log("#"+count+": Request recieved for non-root.");
    res.sendStatus(404);
});

// Listens on port 8001
app.listen(8001, () => {
    console.log("Server established and listening at: http://localhost:8001");
});