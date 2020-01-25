const express = require('express');
const router = express.Router();

const transactionService = require('../services/transaction-service');


router.get('/',async(req, res, next) => {
    
    try
    {
        let transactions;

        transactions = await transactionService.list();
        res.status(200).json(transactions);
      } 
      catch (err) 
      {
        return res.status(500).send(err);
      }
});

router.get('/posting/:accno',async(req, res, next) => {
    

    const accno = req.params.accno;

    try
    {
        let postings;

        postings = await transactionService.listPosting(accno);
        res.status(200).json(postings);
      } 
      catch (err) 
      {
        return res.status(500).send(err);
      }
});


router.get('/postings/:accno',async(req, res, next) => {
    

    const accno = req.params.accno;

    try
    {
        let postings;

        postings = await transactionService.listPostings(accno);
        res.status(200).json(postings);
      } 
      catch (err) 
      {
        return res.status(500).send(err);
      }
});

router.get('/filter/:limit',async(req, res, next) => {
    

    const limit = parseInt(req.params.limit);

    try
    {
        let postings;

        postings = await transactionService.listTransactions(limit);
        res.status(200).json(postings);
      } 
      catch (err) 
      {
        return res.status(500).send(err);
      }
});

router.get('/:id', async(req, res, next) => {

    const id = req.params.id;

    try
    {
        let transaction = await transactionService.get(id);
       
        res.status(200).json(transaction);
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