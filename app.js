//Port configured on Google developer's console
const port = 8080;

const express = require('express');

const app = express();

//Using pug to render
app.set('view engine', 'pug');

//Root route
app.get("/", (req, res) => {
	res.render('index');
});

//Server running prompt
app.listen(port, () => {
	console.log("running on: " + port);
});