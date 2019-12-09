const express = require('express');
const router = express.Router();

const airtimeService = require('../services/airtime-service');
const accTypeDAO = require('../dao/AccTypeDAO');


router.get('/',async(req, res, next) => {
    
    try
    {
        let acctypes;

        acctypes = await airtimeService.list();
        res.status(200).json(acctypes);
      } 
      catch (err) 
      {
        return res.status(500).send(err);
      }
});


router.post('/',(req, res, next) => {

    
    accTypeService.create(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(500).json(err);
    });

});


router.patch('/',(req, res, next) => {

    
    accTypeService.update(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(500).json(err);
    });

});


router.get('/:id', async(req, res, next) => {

    const id = req.params.id;

    try
    {
        let acctype = await accTypeService.get(id);
       
        res.status(200).json(acctype);
    }
    catch (err) 
      {
        return res.status(500).send(err);
      }
});




module.exports = router;