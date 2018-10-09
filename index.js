var express = require('express'); //required for express application
var bodyparser = require('body-parser'); // required for body parsing
var app = express() // create express application
var http = require('http').Server(app); // create an http server with express app
var io = require('socket.io')(http); //attach sockets to io
var mongoose = require('mongoose'); //for mongo db connection

app.use(express.static(__dirname)); // app should use current dir
app.use(bodyparser.json()); // app should use body parser
app.use(bodyparser.urlencoded({extended:false})); // 

//var messages = [{name:'dinesh',message:'Hey D'},{name:'Ashish',message:'Hey A'}]
var dbUrl = "mongodb://mongouser:user1234@ds129422.mlab.com:29422/learning-node";

//Create message model using mongoose
var Message = mongoose.model('Message', {
    name: String,
    message: String
});

//get all messages
app.get('/messages',(req,res) => {
    Message.find( {} , (err, messages) => {
        if(err) {
            sendStatus(500);
        }
        res.send(messages);
    }) 
})


//post a message
app.post('/messages',(req,res) => {
    //messages.push(req.body);
    var message = new Message(req.body);
    message.save((err) => {
        if(err) {
            sendStatus(500);
        }
        else {
            io.emit('new message',req.body); //push event to client 
            //messages.push(message);
            res.sendStatus(200);
        }
    })
    
})

io.on('connection',(socket) => {
    console.log('a user is connected');
})

mongoose.connect(dbUrl, {useNewUrlParser: true },(err) => {
    console.log('mongo db connection with error =  '+ err);
})

var server = http.listen(3000, () => {
    console.log("server is listening on "+ server.address().port);
});

