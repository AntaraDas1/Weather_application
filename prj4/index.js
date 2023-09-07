const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("index.html" , "utf-8");
// const css = fs.readFileSync("style.css" , "utf-8");

const replaceval = (tempval, orgval) => {
  let temperature = tempval.replace("{%tempval%}" , orgval.main.temp);
  temperature = temperature.replace("{%tempmin%}" , orgval.main.temp_min);
  temperature = temperature.replace("{%tempmax%}" , orgval.main.temp_max);
  temperature = temperature.replace("{%location%}" , orgval.name);
  temperature = temperature.replace("{%country%}" , orgval.sys.country);
  // temperature = tempval.repl
  return temperature;
}

const server = http.createServer((req , res) => {
    if(req.url == "/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=kalyani&appid=b001945350c731f82d395da4571f6aa3&units=metric')
        .on('data', (chunk) => {
          const objData = JSON.parse(chunk);
          const arrayData = [objData];
          const realtimeData = arrayData
          .map((val) => replaceval(homeFile , val)).join("");
          res.write(realtimeData);
          console.log(realtimeData)
        })
        .on('end',  (err) => {
          if (err) return console.log('connection closed due to errors', err);
          res.end();
        });
    }
});

server.listen(8000 , "127.0.0.1");