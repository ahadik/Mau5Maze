var querystring = require("querystring"),
	fs = require("fs"),
	formidable = require("formidable"),
	util = require('util'),
	exec = require('child_process').exec;


function start(response, postData) {
	console.log("Request handler 'start' was called");
	
	fs.readFile('home.html', function(err, home_page){
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(home_page);
		response.end();
	});
}



function display(response, request) {
	console.log("Request handler 'display' was called");
	
	var fileindex = global.filenum+1;
	
	var form = new formidable.IncomingForm();
	console.log("about to parse");
	form.parse(request, function(error, fields, files) {
		console.log("parsing done");
		
		exec("sh target/bin/solver "+fields.dim+" "+fields.dim, {encoding: 'utf8', maxBuffer: 400*1024}, function(error, stdout, stderr) {
			var result;
			var resultArray;
			setTimeout(console.log(stdout), 10000);
			var result = stdout.replace(/(\r\n|\n|\r)/gm, "\\n");
			var resultArray = stdout.split("/");
			var mazeResult = '<html>'+
				'<head>'+
				'<meta http-equiv="Content-Type" content="text/html; '+
				'charset=UTF-8" />'+
				'<script type="text/javascript" src="//use.typekit.net/hfl1txa.js"></script>'+
				'<script type="text/javascript">try{Typekit.load();}catch(e){}</script>'+
				'<script>'+
					'var resultData = "'+result+'";'+
					'var resultArray = resultData.split("/");'+
					'var div;'+
					'function updateMaze(mazeData){div.innerHTML = mazeData;}'+
					'function solveMaze(){'+
						'document.getElementById("solve").style.display = "none";'+
						'document.getElementById("restart").style.display = "inline";'+
						'div = document.getElementById("maze");'+
						'var i = 1;'+
						'function loopMaze(){'+
							'updateMaze(resultArray[i]);'+
							'i++;'+ 
							'if(i < resultArray.length-1)'+
							'{'+
								'setTimeout(function() {loopMaze(); }, 1000);'+
							'}'+
						'}'+
						'loopMaze();'+
					'}'+
				'</script>'+
				'<link rel="stylesheet" type="text/css" href="style.css">'+
				'</head>'+
				'<body>'+
				'<div id="wrapper" class="center">'+
					'<div class="center">'+
						'<h2>Randomly Generated Maze</h2>'+
						'<h2>'+fields.dim+' x '+fields.dim+'</h2>'+
					'</div>'+
					'<div id="maze_wrapper">'+
						'<pre id="maze">'+resultArray[0]+'</pre>'+
					'</div>'+
					'<div id="action" class="center">'+
						'<input type="submit" id="solve" class="submit" value="Solve Maze" onclick="solveMaze()">'+
						'<input type="submit" id="restart" class="submit" value="New Maze" onclick="location.href=\'/start\'">'+
						'<a id="restart" href="/start" style="display:none;">Create New Maze</a>'+
					'</div>'+
				'</div>'+
				'</body>'+
				'</html>';
		
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(mazeResult);
			response.end();
		});
	});
}

exports.start = start;
exports.display = display;