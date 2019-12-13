const express = require('express');
const router = express.Router();

const agentService = require('../services/agent-service');
//const agentDAO = require('../dao/AgentDAO');


router.get('/',async(req, res, next) => {
    
    try
    {
        let charges;

        agents = await agentService.list();
        res.status(200).json(agents);
      } 
      catch (err) 
      {
        return res.status(500).send(err);
      }
});


router.get('/list',async(req, res, next) => {
    
    try
    {
        let agents;

        agents = await agentService.list();
        res.status(200).json(agents);
      } 
      catch (err) 
      {
        return res.status(500).send(err);
      }
});


router.post('/',(req, res, next) => {

    
    agentService.create(req.body)
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

    
    agentService.login(req.body)
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

    
    agentService.fund(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(500).json(err);
    });

});

router.post('/acceptOrder',(req, res, next) => {

    
    agentService.acceptOrder(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(500).json(err);
    });

});



// router.get('/:id', async(req, res, next) => {

//     const id = req.params.id;

//     try
//     {
//         let agent = await agentService.get(id);
       
//         res.status(200).json(agent);
//     }
//     catch (err) 
//       {
//         return res.status(500).send(err);
//       }
// });


router.get('/getsingleorder', async(req, res, next) => {

    const id = req.query.refno;

    const payload = {};

    try
    {
        let order = await agentService.getOrder(id);

        
       
        res.status(200).json(order);
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