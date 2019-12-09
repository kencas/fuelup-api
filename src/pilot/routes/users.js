const express = require('express');
const router = express.Router();

const User = require('../model/user');

const userService = require('../services/user-service');


router.get('/',async(req, res, next) => {
    
    try
    {
        let users;

        users = await userService.list();
        res.status(200).json(users);
      } 
      catch (err) 
      {
        return res.status(500).send(err);
      }
});


router.get('/list',async(req, res, next) => {
    
    try
    {
        let users;

        products = await userService.list();
        res.status(200).json(users);
      } 
      catch (err) 
      {
        return res.status(500).send(err);
      }
});


router.post('/',(req, res, next) => {

    
    userService.create(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(500).json(err);
    });

});

router.post('/login',(req, res, next) => {

    
    userService.login(req.body)
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
        let user = await userService.get(id);
       
        res.status(200).json(user);
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
        let user = await userService.get(id);
       
        res.status(200).json(user);
    }
    catch (err) 
      {
        return res.status(500).send(err);
      }
});


router.patch('/:id',(req, res, next) => {

    const id = req.params.id;
    const updateOps = {};

    for(const ops of req.body)
    {
        updateOps[ops.propName] = ops.value;
    }

    User.update({_id: id},{$set: updateOps})
    .exec()
    .then(result => {
        console.log({
            message: "User record updated successfuly",
            flag: true,
        }),
        res.status(200).json({
            message: "User record updated successfuly",
            flag: true,
        });
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({
            error: err,
            message: "There is an error",
            flag: false
        })
    });
});

router.delete('/:id',(req, res, next) => {

    const id = req.params.id;

    User.remove({_id: id})
    .exec()
    .then(result => {
        console.log(result),
        res.status(200).json({
            message: "User record deleted successfuly",
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