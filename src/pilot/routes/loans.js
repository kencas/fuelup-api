const express = require('express');
const router = express.Router();

const customerService = require('../services/customer-service');


router.get('/applications',async(req, res, next) => {
    
    try
    {
        let applications;

        applications = await customerService.loan_applications();
        res.status(200).json(applications);
      } 
      catch (err) 
      {
        return res.status(500).send(err);
      }
});




module.exports = router;