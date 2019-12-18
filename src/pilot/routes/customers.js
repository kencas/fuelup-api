const express = require('express');
const router = express.Router();

const customerService = require('../services/customer-service');


router.post('/startverification',(req, res, next) => {

    
    customerService.initverification(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(200).json(err);
    });

});

router.post('/verifyOTP',(req, res, next) => {

    
    customerService.verifyOTP(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(200).json(err);
    });

});


router.post('/verifypin',(req, res, next) => {

    
    customerService.verifypin(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(200).json(err);
    });

});



router.post('/configurePin',(req, res, next) => {

    
    customerService.configurepin(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(200).json(err);
    });

});


router.post('/signup',(req, res, next) => {

    
    customerService.create(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(200).json(err);
    });

});

router.post('/createOrder',(req, res, next) => {

    
    customerService.createOrder(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(200).json(err);
    });

});

router.post('/initfunding',(req, res, next) => {

    
    customerService.initfunding(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(200).json(err);
    });

});

router.post('/verifytransaction',(req, res, next) => {

    
    customerService.verifytransaction(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(200).json(err);
    });

});

router.post('/transfermoney',(req, res, next) => {

    
    customerService.transfermoney(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(200).json(err);
    });

});



router.get('/orders',async(req, res, next) => {
    
    try
    {
        let orders;

        orders = await customerService.listOrder(req.query.customerId);
        res.status(200).json(orders);
      } 
      catch (err) 
      {
        return res.status(200).send(err);
      }
});

router.get('/transactions',async(req, res, next) => {
    
    try
    {
        let transactions;

        transactions = await customerService.listTransaction(req.query.customerId);
        console.log(transactions);
        res.status(200).json(transactions);
      } 
      catch (err) 
      {
        return res.status(200).send(err);
      }
});


router.get('/list',async(req, res, next) => {
    
    try
    {
        let customers;

        customers = await customerService.list();
        res.status(200).json(customers);
      } 
      catch (err) 
      {
        return res.status(200).send(err);
      }
});

router.get('/',async(req, res, next) => {
    
    try
    {
        let customers;

        customers = await customerService.list();
        res.status(200).json(customers);
      } 
      catch (err) 
      {
        return res.status(200).send(err);
      }
});


router.post('/',(req, res, next) => {

    
    customerService.create(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(200).json(err);
    });

});

router.post('/checkloaneligibility',(req, res, next) => {

    
    customerService.checkLoanEligibility(req.body)
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
        let customer = await customerService.get(id);
       
        res.status(200).json(customer);
    }
    catch (err) 
      {
        return res.status(200).send(err);
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
        return res.status(200).send(err);
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
        res.status(200).json({
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
        res.status(200).json({
            error: err,
            message: "Error occurred",
            flag: false,
        })
    });
});

module.exports = router;