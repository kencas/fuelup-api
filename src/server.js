const http = require('http');
const app = require('./app');

const port  = process.env.PORT || 3000;
const server =  http.createServer(app);


// const io = require('socket.io')(server);


var drivers = {};

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