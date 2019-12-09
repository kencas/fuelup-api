const express = require('express');
const router = express.Router();

const bankService = require('../services/bank-service');
const bankDAO = require('../dao/BankDAO');

router.get('/',async(req, res, next) => {
    
    try
    {
        let banks;

        banks = await bankDAO.list();
        res.status(200).json(banks);
      } 
      catch (err) 
      {
        return res.status(500).send(err);
      }
});


router.post('/',(req, res, next) => {

    
    bankDAO.create(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(500).json(err);
    });

});


router.post('/fund',(req, res, next) => {

    
    bankService.fund(req.body)
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
        let bank = await bankService.get(id);
       
        res.status(200).json(bank);
    }
    catch (err) 
      {
        return res.status(500).send(err);
      }
});



router.patch('/',(req, res, next) => {

    const id = req.body.id;
    const updateOps = {};

    for(const ops of req.body.data)
    {
        updateOps[ops.propName] = ops.value;
    }

    Agent.update({_id: id},{$set: updateOps})
    .exec()
    .then(result => {
        console.log({
            message: "Agent record updated successfuly",
            flag: true,
        }),
        res.status(200).json({
            message: "Agent record updated successfuly",
            flag: true,
        });
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({
            payload: err,
            message: "There is an error",
            flag: false
        })
    });
});

router.delete('/:id',(req, res, next) => {

    const id = req.params.id;

    Agent.remove({_id: id})
    .exec()
    .then(result => {
        console.log(result),
        res.status(200).json({
            message: "Agent record deleted successfuly",
            flag: true,
        });
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({
            error: err,
            message: "Error occurred",
            flag: false,
        })
    });
});

module.exports = router;