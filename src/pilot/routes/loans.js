const express = require('express');
const router = express.Router();

const customerService = require('../services/customer-service');

const loanOfferService = require('../services/loanoffer-service');


router.get('/loanoffers',async(req, res, next) => {
    
    try
    {
        let applications;

        applications = await loanOfferService.list();
        res.status(200).json(applications);
      } 
      catch (err) 
      {
        return res.status(500).send(err);
      }
});

router.post('/loanoffers',async(req, res, next) => {
    
  loanOfferService.create(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(500).json(err);
    });
});




module.exports = router;