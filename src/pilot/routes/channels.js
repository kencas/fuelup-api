const express = require('express');
const router = express.Router();

const channelService = require('../services/channel-service');
const channelDAO = require('../dao/ChannelDAO');

router.get('/',async(req, res, next) => {
    
    try
    {
        let charges;

        channels = await channelDAO.list();
        res.status(200).json(channels);
      } 
      catch (err) 
      {
        return res.status(500).send(err);
      }
});


router.post('/',(req, res, next) => {

    
    channelDAO.create(req.body)
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
        let channel = await channelService.get(id);
       
        res.status(200).json(channel);
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

    Channel.update({_id: id},{$set: updateOps})
    .exec()
    .then(result => {
        console.log({
            message: "Channel record updated successfuly",
            flag: true,
        }),
        res.status(200).json({
            message: "Channel record updated successfuly",
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

    Channel.remove({_id: id})
    .exec()
    .then(result => {
        console.log(result),
        res.status(200).json({
            message: "Channel record deleted successfuly",
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