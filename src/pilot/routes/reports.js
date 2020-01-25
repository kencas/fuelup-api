const express = require('express');
const router = express.Router();

const reportService = require('../services/report-service');


router.get('/dashboard',async(req, res, next) => {
    
    try
    {
        let report;

        report = await reportService.dashboard();
        res.status(200).json(report);
      } 
      catch (err) 
      {
        return res.status(500).send(err);
      }
});


router.post('/',(req, res, next) => {

    
    productService.create(req.body)
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
        let ledger = await ledgerService.get(id);
       
        res.status(200).json(ledger);
    }
    catch (err) 
      {
        return res.status(500).send(err);
      }
});

router.get('/get/:id', async(req, res, next) => {

    const id = req.params.id;

    try
    {
        let product = await productService.get(id);
       
        res.status(200).json(product);
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

    Product.update({_id: id},{$set: updateOps})
    .exec()
    .then(result => {
        console.log({
            message: "Product record updated successfuly",
            flag: true,
        }),
        res.status(200).json({
            message: "Product record updated successfuly",
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

    Product.remove({_id: id})
    .exec()
    .then(result => {
        console.log(result),
        res.status(200).json({
            message: "Product record deleted successfuly",
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