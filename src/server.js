const http = require('http');
const app = require('./app');

const port  = process.env.PORT || 3000;
const server =  http.createServer(app);


const io = require('socket.io')(server);


var drivers = {};

var clients = {};

var agents = {};

io.on('connection', function(socket){

    console.log("Cleint connected: " + socket.id);
 
    socket.on('agentlogin', function(data){

        var response = {
            message: "Login successful",
            flag: true,
            payload: data
        };

        console.log("Data: " + data);

        clients[data.agentId] = {
          "socket": socket.id
        };

        io.to(socket.id).emit('agentlogonsuccess', response);
      });


      socket.on('notifyorder', function(data){
        io.to(clients[data.agentId].socket).emit('neworder', {
            message: "New order created",
            flag: true,
            payload: data.order
        });
      });
 
});

// io.on('connection', function(socket) {  
//     console.log('Client connected...');

    

//     socket.on('online', function(data) {
//         console.log(data);
//         //var obj = JSON.parse(data);
//         console.log(data.longitude);
//         Transaction.updateStatus(data);

//         socket.emit('available-driver', data);
    
//     });

//     socket.on('login', function(data) {
        

//         drivers[data.userID] = {
//             "socket": socket.id
//           };

//           console.log("Driver ID: " + data.userID);
//           console.log("Socket ID: " + socket.id);
//     });


//     socket.on('create-ride-request', function(data){
//         console.log("Data from request: " + data);
//         if (drivers[data.driver])
//         {
//             //create request
//             console.log("Message sent: " + drivers[data.driver].socket); 
//             socket.to(drivers[data.driver].socket).emit("notify-ride-request", data);
//         } else {
//           console.log("User does not exist: " + data.driver); 
//         }
//       });

//     socket.on('disconnect', function() {
//         for(var name in drivers) {
//             if(drivers[name].socket === socket.id) {
//                 delete drivers[name];
//                 var data = {
//                     referenceID: name,
//                     longitude: 0,
//                     latitude: 0,
//                     status: "Offline"
//                 };
//                 //Transaction.updateStatus(data);
//                 break;
//             }
//         }	
//     });
  

// });

server.listen(port);