const helmet = require('helmet')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const compression = require('compression')

app.use(helmet())
app.use(compression())
app.use(express.static('build'))
server.listen(80);
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/build/index.html')
})

module.exports = require('socket.io')(server)