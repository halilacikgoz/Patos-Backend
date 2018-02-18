const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const admin = require('firebase-admin');




app.use(bodyParser.urlencoded({extended: true}))

var db;
MongoClient.connect('mongodb://foter:12345@ds237868.mlab.com:37868/hackathon', (err, client) => {
	if (err) return console.log(err)
	db = client.db('hackathon') 
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

		var myquery = { id: req.body.id };
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

		var start=new Date(body[header[0]])
		var end  =new Date(body[header[1]])
		var kg  =body[header[2]]

		db.collection('cars').find({"departureDate": {"$gte":start, "$lt":end} }).toArray((err,results) =>{

			var data = [];
				results.forEach(function(element){
					if (parseInt(element.currentKg, 10) + parseInt(kg, 10)<= element.maxKg)
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
	

app.post('/addpacket', (req, res) => {

	console.log(req.body)
	var carID			=req.body.carID;
	var userID		=req.body.userID;
	var packageKG=req.body.packageKG;
	var latitude =req.body.slatitude;
	var longitude=req.body.slongitude;
	var dlatitude =req.body.dlatitude;
	var dlongitude=req.body.dlongitude;
	var query = {'_id': new ObjectId(carID)};
	
	console.log(carID)
	db.collection('cars').findOne(query, function(err, r1) {
		
		if (err){
			 res.json({"code":-2,"msg":"CarId not found"})
			 
		}else
		{
			if (parseInt(r1.currentKg, 10) + parseInt(packageKG, 10)  <= r1.maxKg ){

				var updatedata ={  $set :{ "currentKg": parseInt(r1.currentKg, 10) + parseInt(packageKG, 10) },'$addToSet': {'packetlist': [userID,packageKG,latitude,longitude,dlatitude,dlongitude]}};
				db.collection("cars").updateOne(query, updatedata, function(err, r2) {
					if (err){

						console.log(err)
						console.log(r2)
						res.json({
							"code":-1,
							"msg":"Unsuccessfully",

						});
						
					}
					else{

						db.collection("packets").insertOne({"userID":userID,"carID":carID,"packet":packageKG}, function(err, r3) {
							if (err) throw err;
							console.log("1 packets inserted");
						});

						res.json({
							"code":0,
							"msg":"Successfully added",});
						}
				});
			}
			else{
				res.json({"code":-3,"msg":"Not enough space"})
			}
			
		}
	});
	
})

app.get('/getorders',  (req, res) => {
	var user_id = req.query['id'];
	console.log("--------------")

	db.collection('packets').find({"userID":user_id}).toArray((err,results) =>{
			res.json({
				"code":0,
				"msg":"success",
				"data":results
			});

		})
		
})
app.get('/getcar',  (req, res) => {
	var car_id = req.query['id'];
	var query = {'_id': new ObjectId(car_id)};
	
	db.collection('cars').findOne(query, function(err, r1) {
			res.json({
				"code":0,
				"msg":"succes",
				"data":r1
			});

	
		})
		
})

app.get('/', (req, res) => {
	console.log("first path")
	res.sendFile(__dirname + '/index.html')
})