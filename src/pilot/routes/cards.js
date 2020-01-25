const express = require('express');
const router = express.Router();

const Card = require('../model/card');

const cardService = require('../services/card-service');

router.get('/',async(req, res, next) => {
    
    try
    {
        let charges;

        cards = await cardService.list();
        res.status(200).json(cards);
      } 
      catch (err) 
      {
        return res.status(200).send(err);
      }
});


router.post('/',(req, res, next) => {

    
    cardService.create(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(200).json(err);
    });

});



router.get('/:id', async(req, res, next) => {

    const id = req.params.id;

    try
    {
        let card = await cardService.get(id);
       
        res.status(200).json(card);
    }
    catch (err) 
      {
        return res.status(200).send(err);
      }
});



router.patch('/',(req, res, next) => {

    const id = req.body.id;
    const updateOps = {};

    console.log(req.body);

    for(const ops of req.body.data)
    {
        updateOps[ops.propName] = ops.value;
    }

    Card.update({_id: id},{$set: updateOps})
    .exec()
    .then(result => {
        console.log({
            message: "Card record updated successfuly",
            flag: true,
        }),
        res.status(200).json({
            message: "Card record updated successfuly",
            flag: true,
        });
    })
    .catch(err => {
        console.log(err),
        res.status(200).json({
            payload: err,
            message: "There is an error",
            flag: false
        })
    });
});

router.delete('/:id',(req, res, next) => {

    const id = req.params.id;

    Card.remove({_id: id})
    .exec()
    .then(result => {
        console.log(result),
        res.status(200).json({
            message: "Card record deleted successfuly",
            flag: true,
        });
    })
    .catch(err => {
        console.log(err),
        res.status(200).json({
            error: err,
            message: "Error occurred",
            flag: false,
        })
    });
});

module.exports = router;