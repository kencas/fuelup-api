const express = require('express');
const app =  express();
var bodyParser = require('body-parser');
// Config body-parser
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
  });
const mongoose = require('mongoose');
const config = require('./config');




mongoose.connect(config.database,{ useNewUrlParser: true },function(err)
{
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log("Connected to the Database");
    }
});

mongoose.Promise = global.Promise;

const userRoutes = require('./pilot/routes/users');
const customerRoutes = require('./pilot/routes/customers');
const ussdRoutes = require('./pilot/routes/ussd');
const ussdLiteRoutes = require('./pilot/routes/ussdlite');
const transactionRoutes = require('./pilot/routes/transactions');
const ledgerRoutes = require('./pilot/routes/ledgers');
const chargeRoutes = require('./pilot/routes/charges');
const agentRoutes = require('./pilot/routes/agents');
const bankRoutes = require('./pilot/routes/banks');
const merchantRoutes = require('./pilot/routes/merchants');
const accTypeRoutes = require('./pilot/routes/acctypes');
const reportRoutes = require('./pilot/routes/reports');
const loanRoutes = require('./pilot/routes/loans');
// // app.use((req,res,next) => {
// //     res.status(200).json({
// //         message: "it works well for me"
// //     });
// // });




 app.use('/users',userRoutes);
 app.use('/transactions',transactionRoutes);
 app.use('/ussd',ussdRoutes);
 app.use('/ussdlite',ussdLiteRoutes);
 app.use('/customers',customerRoutes);
 app.use('/ledgers',ledgerRoutes);
 app.use('/charges',chargeRoutes);
 app.use('/agents',agentRoutes);
 app.use('/banks',bankRoutes);
 app.use('/merchants',merchantRoutes);
 app.use('/acctypes',accTypeRoutes);
 app.use('/reports',reportRoutes);
 app.use('/loans',loanRoutes);

// app.use((req, res, next) =>{
//     const error = new Error('Invalid request');
//     error.status = 404;
//     next(error);
// });

// app.use((error, req, res, next) =>{
//     res.status(error.status);
//     res.json({
//         error :{
//             message : error.message
//         }
//     });
// });

module.exports = app;