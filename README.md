<h1>Carry Me</h1>
<p>Do you get tired of transportation problems? Don't you believe in transportation companies? With this application, you will have opportunity to choose.</p>
<p>Mainly, you just pick weight of the cargo, dates which you want your cargo to be carried and destination location, and then, we search all available car owners on the system. You will see a list of cars which is going to there. If you pick one, the system will automatically match you up and assign your cargo to the car. </p>

<h2>Technical Parts</h2>
<h3>Server Side</h3>
<p>NodeJS server runs on heroku platform (https://protected-dusk-58376.herokuapp.com). It has .. post and .. get methods:</p>
<p>POST /car       .. adds new car</p>
<p>POST /update    .. updates a car</p>
<p>POST /getbydate .. returns available cars between two dates and have space for the cargo</p>
<p>GET  /getall    .. returns all cars</p>
<p>POST /addpacket .. assigns a packet to the car</p>
<p>GET  /getorders .. returns all packets of the user</p>

<h3>Database Side</h3>
<p>MongoDB runs on mLab platform (ds237868.mlab.com:37868). It has two collections:</p>
<p>*Cars*    .. holds car information (driverName, carID, startPoint, destinationPoint etc.)</p>
<p>*Packets* .. holds packet information (packetID, weight etc.)</p>

<h2>Team</h2>
<b>Patos Team</b><br/>
<b>Fatih Altuntaş</b> .. Database & NodeJS connection <br/>
<b>Ahmet Görünücü</b> .. NodeJS & Android connection <br/>
<b>Halil İbrahim Açıkgöz</b> <br/>
