import createBareServer from '@tomphttp/bare-server-node';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import serveStatic from 'serve-static';

const PORT = process.env.PORT || 3000;
const bareServer = createBareServer('/bare/', {
  logErrors: false,
  localAddress: undefined
});

process.on('message', (parentMessage) => {
  const { parent } = parentMessage
  console.log('Message from parent process:', parent); // parent = 'Be good my child!'  
});

const serve = serveStatic(join(
  dirname(fileURLToPath(import.meta.url)),
  'static/'
), {
  fallthrough: false,
  maxAge: 5 * 60 * 1000
});

const server = http.createServer();
server.on('request', (request, response) => {
  try {

    if (bareServer.shouldRoute(request)) {
      bareServer.routeRequest(request, response);
    } else {
      serve(request, response, err => {
        response.writeHead(err?.statusCode || 500, null, {
          "Content-Type": "text/plain"
        })
        response.end(err?.stack)
      });
    }
  } catch (e) {
    response.writeHead(500, "Internal Server Error", {
      "Content-Type": "text/plain"
    })
    response.end(e.stack)
  }
});
server.on('upgrade', (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
  bareServer.routeUpgrade(req, socket, head);
  } else {
  socket.end();
  }
});
// PORT error handling. Ty SO <3
let duration = 2000
let left = 1 // attempts left
let showErrMsg = true
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        left = left - 1
        let message
        if (showErrMsg) {
            message = (`port ${PORT} already in use`)
            console.log(message)
            showErrMsg = false
        }
        message = `trying to restart the service on port ${PORT}... attempts left ${left} `
        console.log(message)
        if (left !== 0) {
            console.log(left)
            setTimeout(() => server.listen(PORT), duration)
        } else {
            message = `Server is shutting down`
            console.error(message)
            let quitMessage = "SHUTDOWN: EADDRINUSE"
            process.send(quitMessage);
        }
    }
})
server.listen(PORT);

if (process.env.UNSAFE_CONTINUE)
  process.on("uncaughtException", (err, origin) => {
    console.error(`Critical error (${origin}):`)
    console.error(err)
    console.error("UNSAFELY CONTINUING EXECUTION")
    console.error()
  })

console.log(`Server running at http://localhost:${PORT}/.`);
