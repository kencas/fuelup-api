const express = require('express');
const router = express.Router();

const chargeService = require('../services/charge-service');


router.get('/',async(req, res, next) => {
    
    try
    {
        let charges;

        charges = await chargeService.list();
        res.status(200).json(charges);
      } 
      catch (err) 
      {
        return res.status(500).send(err);
      }
});


router.post('/',(req, res, next) => {

    
    chargeService.create(req.body)
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
        let charge = await chargeService.get(id);
       
        res.status(200).json(charge);
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

    Charge.update({_id: id},{$set: updateOps})
    .exec()
    .then(result => {
        console.log({
            message: "Charge record updated successfuly",
            flag: true,
        }),
        res.status(200).json({
            message: "Charge record updated successfuly",
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

    Charge.remove({_id: id})
    .exec()
    .then(result => {
        console.log(result),
        res.status(200).json({
            message: "Charge record deleted successfuly",
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