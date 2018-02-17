const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}))
//app.use(bodyParser.json())




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
	var query = {'_id': new ObjectId(carID)};
	
	console.log(carID)
	
	
	//var updatedata={ '$push': {'packetlist': "userID"}};
	db.collection('cars').findOne(query, function(err, r1) {
		
		if (err){
			 res.json({"code":-2,"msg":"CarId not found"})
			 
		}else
		{
			if (parseInt(r1.currentKg, 10) + parseInt(packageKG, 10)  <= r1.maxKg ){

				var updatedata ={  $set :{ "currentKg": parseInt(r1.currentKg, 10) + parseInt(packageKG, 10) },'$addToSet': {'packetlist': [userID,packageKG]}};
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

app.get('/getorders', (req, res) => {
	var user_id = req.query['id'];
	console.log(user_id)


	db.collection('packets').find({"userID":user_id}).toArray((err,results) =>{

		if (err){
				res.json({
					"code":-1,
					"msg":"eror",
				});

		}else{

			var data = [];			
			console.log(results.length)
			console.log(results)
			for (var i=0; i<results.length; i++) {
				var item=results[i]
				
				var query = {'_id': new ObjectId(item.carID)};

				db.collection('cars').findOne(query, function(err, car) {
					console.log(car)
					
					console.log(results[i])
					console.log("-----")
					console.log(results[i])
				});	
				
			}
			res.json({
				"code":0,
				"msg":"succes",
				"data":results
			});
		}
		})
		
})
		

app.get('/', (req, res) => {
	console.log("first path")
	res.sendFile(__dirname + '/index.html')
})