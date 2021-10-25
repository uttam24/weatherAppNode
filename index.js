const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal =(tempVal, orgVal)=>{
	let temperature =tempVal.replace("{%tempval%}", orgVal.main.temp);
	temperature =temperature.replace("{%tempmin%}", orgVal.main.temp_min);
	temperature =temperature.replace("{%tempmax%}", orgVal.main.temp_max );
	temperature =temperature.replace("{%location%}", orgVal.name);
	temperature =temperature.replace("{%country%}", orgVal.sys.country);
	temperature =temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
	return temperature;	
}

const server = http.createServer((req, res)=>{
	if(req.url == "/"){
		requests("http://api.openweathermap.org/data/2.5/weather?q=delhi&appid=21bc870eb7916678d41e46821895efa8")
		.on('data', (chunk)=> {
		  const object= JSON.parse(chunk);
		  const arrData = [object]
		  const realTimeData = arrData.map((val) =>replaceVal(homeFile, val)).join("");
		  res.write(realTimeData);
		})
		.on('end', (err)=> {
		  if (err) return console.log('connection closed due to errors', err);
		  res.end();
		});
	}
}) 

server.listen(4500)