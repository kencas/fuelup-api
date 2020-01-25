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

router.post('/applyloan',(req, res, next) => {

    
    customerService.applyloan(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(200).json(err);
    });

});

router.post('/repayloan',(req, res, next) => {

    
    customerService.repayloan(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(200).json(err);
    });

});

router.post('/applyfuelcard',(req, res, next) => {

    
    customerService.applyfuelcard(req.body)
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

router.post('/changePin',(req, res, next) => {

    
    customerService.changepin(req.body)
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

router.post('/register',(req, res, next) => {

    
    customerService.signup(req.body)
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
        console.log(orders);
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


router.get('/loans',async(req, res, next) => {
    
    try
    {
        let loans;

        loans = await customerService.listLoan(req.query.customerId);
        console.log(loans);
        res.status(200).json(loans);
      } 
      catch (err) 
      {
        return res.status(200).send(err);
      }
});


router.get('/getuser',async(req, res, next) => {
    
    try
    {
        let customer;

        customer = await customerService.getUser(req.query.phoneno);
        
        res.status(200).json(customer);
      } 
      catch (err) 
      {
        return res.status(200).send(err);
      }
});

router.get('/view',async(req, res, next) => {
    
    try
    {
        let customer;

        customer = await customerService.get(req.query.Id);
        
        res.status(200).json(customer);
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



router.get('/getuser', async(req, res, next) => {

    const id = req.query.phoneno;

    try
    {
        let customer = await customerService.getUser(id);
       
        res.status(200).json(customer);
    }
    catch (err) 
      {
        return res.status(200).send(err);
      }
});


router.get('/logToken', async(req, res, next) => {

    const phoneno = req.query.phoneno;

    const token = req.query.token;

    
        await customerService.logToken({phoneno: phoneno, token: token});
      
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


router.post('/updateprofile',(req, res, next) => {

    customerService.update(req.body)
    .then(result => {
        console.log(result),
        res.status(200).json(result);
    })
    .catch(err => {
            
         console.log(err),
        res.status(200).json(err);
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