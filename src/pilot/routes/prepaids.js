const express = require('express');
const router = express.Router();

const prepaidService = require('../services/prepaid-service');


router.get('/',async(req, res, next) => {
    
    try
    {
        let prepaids;

        prepaids = await prepaidService.list();
        res.status(200).json(prepaids);
      } 
      catch (err) 
      {
        return res.status(500).send(err);
      }
});


router.post('/',(req, res, next) => {

    
    prepaidService.create(req.body)
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
        let agent = await prepaidService.get(id);
       
        res.status(200).json(agent);
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