const mongose =require('mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const reporters = mongose.Schema({
    name:{
        type:String,
        required:true,
        trim:true ,
        lowercase:true            
    },
    email:{
        type:String,
        required:true,
        lowercase:true, 
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    phoneNumber:{
        type:Number,
        validate(num){
            if(!validator.isMobilePhone(num,'ar-EG')){
                throw new Error('Phone Number is wrong, Check back')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        minLength:8
    },
    tokens:[
        {
            token:{
            type:String,
            required:true
            }
        }
        ]
});

// The Relation Between news and Reporters

reporters.virtual('news',{
    ref:'New', 
    localField:'_id',
    foreignField:'owner'
});

reporters.pre('save',async function(next){
    const reporter = this; 
    if(reporter.isModified('password')){
    reporter.password= await bcrypt.hash(reporter.password,8)
    }
    next()
})


reporters.statics.findByCredentials = async(email,password) =>{
    const reporter = await Reporter.findOne({email})
    if(!reporter){
        throw new Error('Unable to login. Please check email or password');
    }

    const isMatch = await bcrypt.compare(password,reporter.password);

    if(!isMatch){
        throw new Error('Unable to login. Please check email or password');
    }

    return reporter;
}

reporters.methods.generateToken = async function () {
    const reporter= this ; 
    const token = jwt.sign({_id:reporter._id.toString()},'node');
    reporter.tokens = reporter .tokens.concat({token:token});
    await reporter.save();
    return token;

}

const Reporter = mongose.model('Reporter',reporters);
module.exports= Reporter;