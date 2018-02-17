const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient

const bodyParser = require('body-parser');


//app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())




var db;
MongoClient.connect('mongodb://foter:12345@ds237868.mlab.com:37868/hackathon', (err, client) => {
	if (err) return console.log(err)
	db = client.db('hackathon') // whatever your database name is
	app.listen(process.env.PORT || 5000, function() {
		console.log('listening on 5000')
	});


	
})

app.post('/car', (req, res) => {
		console.log(req.body);
		db.collection('cars').save(req.body, (err, result) => {
		if (err) {
			res.json({
				"code":-1,
				"msg":"uncessfull",
		  
			  });
		}
		else{
			console.log('saved to database')
			res.json({
				"code":0,
				"msg":"Successfuly insterted",
		  
			  });
		}
		
	  })
	});

app.post('/update', (req, res) => {
		console.log(req.body);

		var myquery = { id: 90 };
 	    var newvalues = { $set: {arrivalLat: 1, arrivalLong: 2 } };

		db.collection("cars").updateOne(myquery, newvalues, function(err, result) {
			console.log(err)
			if (err) {
			res.json({
				"code":-2,
				"msg":"uncessfull update",
		  
			  });
		}
		else{
			console.log("1 document updated");
			res.json({
				"code":0,
				"msg":"Successfuly update",
		  
			  });
			}
			

		  });

		
		
	  })


function showObject(obj) {
		var result = [];
		for (var p in obj) {
		  if( obj.hasOwnProperty(p) ) {
			result.push(p);
		  }
		}
		return result;
	}
	  

app.post('/getbydate', (req, res) => {
		var body=req.body
		header=showObject(body)
		console.log(header)
		console.log(body)
	
		var start=new Date(body[header[0]])
		var end  =new Date(body[header[1]])
		var kg  =body[header[2]]
	
		console.log(start);
		console.log(end);
		console.log(kg);
		console.log("------------")
		
		//var start=new Date(2018,01,01);
		//var end = new Date(2018,09,09);
		
		//db.collection('cars').find({"departureDate": {"$gte":start, "$lt":end},currentKg:{"$lte":"$maxKg"-kg}}).toArray((err,results) =>{
		db.collection('cars').find({"departureDate": {"$gte":start, "$lt":end} }).toArray((err,results) =>{

			

			var data = [];
			results.forEach(function(element){
				if (element.currentKg+kg <= element.maxKg)
				{
				
					data.push(element)
				}
				
			  });

			
			res.json({
			  "code":0,
			  "msg":"Success",
			  "records":data
		
			});
		
		
		  })
})

app.get('/getall', (req, res) => {
		db.collection('cars').find().toArray((err,results) =>{

			console.log(results.length)
			console.log(results[0])
			res.json({
			  "code":0,
			  "msg":"Success",
			  "records":results
		
			});
		  })
})
	  

app.get('/', (req, res) => {
	console.log("first path")
	res.sendFile(__dirname + '/index.html')
})