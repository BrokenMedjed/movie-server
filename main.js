// just read LICENSE.txt... am too lazy to write the MIT stuff here

const https = require("https");
const fs    = require("fs");

const certs = {
	key:  __dirname + "/certs/cert.key",
	cert: __dirname + "/certs/cert.pem",
	root: __dirname + "/certs/root.pem"
};

if (process.argv.length < 5) {
	console.log("[" + process.argv[1] + "] usage: node " + process.argv[1] + " <host port> <file> <mime type>");
	process.exit(1);
}

try {
	parseInt(process.argv[2]);
} catch (err) {
	console.log("[" + process.argv[1] + "] Invalid port");
	process.exit(1);
}

if (!fs.existsSync(process.argv[3])) {
	console.log("[" + process.argv[1] + "] Invalid file");
	process.exit(1);
}

if (!fs.existsSync(certs["root"])) {
	console.log("[" + process.argv[1] + "] SSL root CA missing - run gen_root.sh first");
	process.exit(1);
}

if (!fs.existsSync(certs["key"]) || !fs.existsSync(certs["cert"])) {
	console.log("[" + process.argv[1] + "] SSL certificate missing - run gen_cert.sh first");
	process.exit(1);
}

const certopt = {
	key:  fs.readFileSync(certs["key"]),
	cert: fs.readFileSync(certs["cert"]),
	ca:   fs.readFileSync(certs["root"])
};

https.createServer(certopt, (req, res) => {
	const url = new URL(req.url, "https://futaba/");
	if (url.pathname == "/content") {
		const fsize     = fs.statSync(process.argv[3]).size;
		const range_hdr = req.headers["range"];
		console.log("[" + process.argv[1] + "] Serving " + String(fsize) + " bytes");
		if (range_hdr) {
			const range_parts = range_hdr.replace(/bytes=/, "").split("-");
			const range_start = parseInt(range_parts[0]);
			const range_end   = (range_parts[1]) ? parseInt(range_parts[1]) : fsize;
			const chunksize   = (range_end - range_start) + 1;
			console.log("[" + process.argv[1] + "] Serving partial content, chunk start " + String(range_start) + ", size " + String(chunksize) + " bytes");
			res.writeHead(206, {
				"Content-Range":  "bytes " + range_start + "-" + range_end + "/" + fsize,
				"Accept-Ranges":  "bytes",
				"Content-Length": chunksize,
				"Content-Type":   process.argv[4]
			});
			const stm = fs.createReadStream(process.argv[3], {range_start, range_end});
			stm.on("data", (chunk) => { res.write(chunk, "binary"); });
			stm.on("end",  ()      => { res.end(); });
		} else {
			console.log("[" + process.argv[1] + "] Serving file in one chunk");
			res.writeHead(200, {
				"Content-Length": fsize,
				"Content-Type":   process.argv[4]
			});
			const stm = fs.createReadStream(process.argv[3]);
			stm.on("data", (chunk) => { res.write(chunk, "binary"); });
			stm.on("end",  ()      => { res.end(); });
		}
	} else {
		console.log("[" + process.argv[1] + "] Serving client");
		res.writeHead(200, {
			"Content-Type": "text/html"
		});
		res.end("<!DOCTYPE html><html><head><title>Medjed Client</title><meta charset=\"utf-8\"></head><body><video type=\"" + process.argv[4] + "\" src=\"/content\" controls></video></body></html>");
	}
}).listen(parseInt(process.argv[2]), "0.0.0.0");
console.log("Listening on " + process.argv[2]);
