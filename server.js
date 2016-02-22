var types = {
  "css": "text/css",
  "gif": "image/gif",
  "html": "text/html",
  "ico": "image/x-icon",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "js": "text/javascript",
  "json": "application/json",
  "pdf": "application/pdf",
  "png": "image/png",
  "svg": "image/svg+xml",
  "swf": "application/x-shockwave-flash",
  "tiff": "image/tiff",
  "txt": "text/plain",
  "wav": "audio/x-wav",
  "wma": "audio/x-ms-wma",
  "wmv": "video/x-ms-wmv",
  "xml": "text/xml"
};
module.exports.startServer = function (port, logger) {
  var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    path = require('path');

  var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    //跟目录信息
    //console.log(1);
    //var realPath = path.join("app", pathname);
    var realPath = pathname.substr(1, pathname.length);
    logger.info("Request "+realPath);
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    fs.exists(realPath, function (exists) {
      if (!exists) {
        response.writeHead(404, {
          'Content-Type': 'text/plain'
        });

        response.write("This request URL " + pathname + " was not found on this server.");
        response.end();
      } else {
        fs.readFile(realPath, "binary", function (err, file) {
          if (err) {
            response.writeHead(500, {
              'Content-Type': 'text/plain'
            });
            response.end(err);
          } else {
            var contentType = types[ext] || "text/plain";
            response.writeHead(200, {
              'Content-Type': contentType
            });
            response.write(file, "binary");
            response.end();
          }
        });
      }
    });
  });
  server.listen(port);
  logger.info("Server running at 127.0.0.1:" + port);
};
