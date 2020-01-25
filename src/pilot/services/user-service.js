const User = require('../model/user');

module.exports = class UserService{ 
    
    constructor() {
      
    }

    
    
    static create(cust) {

        var response = {
            flag: false,
            message: 'Error signing up',
            payload: null
        };

        

      return new Promise(async(resolve, reject) => {
        const user = new User({
            username: cust.username,
            password: cust.password,
            role: cust.role
        });

        var usr = await User.findOne({username: cust.username});

        if(usr != null)
        {
            response.flag = false;
            response.message = 'User already exist';

            return resolve(response);
        }


        user
    .save()
    .then(async(result) => {
        console.log(result);
        response.flag = true;
        response.message = 'User created successfully';
        response.payload = result;

        
        resolve(response);
    })
    .catch(err => {
        console.log(err)
        reject(error);
    });
      });
    }

    


    static async list() {

      
       
        return User.find();

      
    }

    static async get(id) {

      
       
      return User.findById(id);

    
  }

  static login(cust) {

    var response = {
        flag: false,
        message: 'Error Logging In',
        payload: {}
    };

    let user = null;

  

  return new Promise(async(resolve, reject) => {



user = await User.findOne({username: cust.username, password: cust.password}).select('username');

if(user == null)
{
    return resolve(response);
}

response.flag = true;
response.payload = user;
response.message = "User Logged on successfully";
     resolve(response);
  });
}

  
  }