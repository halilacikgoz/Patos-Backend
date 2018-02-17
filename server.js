const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient

const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({extended: true}))
//app.use(bodyParser.json())

MongoClient.connect('mongodb://foter:12345@ds237868.mlab.com:37868/hackathon', (err, client) => {
	if (err) return console.log(err)
	db = client.db('hackathon') // whatever your database name is
	app.listen(3000, function() {
		console.log('listening on 3000')
	});


	
	app.post('/car', (req, res) => {
		console.log(req.body);
		db.collection('cars').save(req.body, (err, result) => {
		if (err) return console.log(err)

		console.log('saved to database')
		res.redirect('/')
	  })
	});
})