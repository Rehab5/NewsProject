const express = require('express');
const router = new express.Router();
const Reporter = require('../models/reporter');
const auth = require('../middleware/auth');

//Post
router.post('/reporter', (req,res) =>{
    const reporter = new Reporter(req.body);
    reporter.save().then(() =>{
        res.status(200).send(reporter);
    }).catch((error) =>{
        res.status(400).send(error);
    })
});

//Get All
router.get('/reporter',auth,(req,res)=>{
    Reporter.find({}).then((el)=>{
        res.status(200).send(el)
    }).catch((error)=>{
        res.status(400).send(error)
    })
});

//Get by Id
router.get('/reporter/:id',auth,(req,res)=>{
    const _id= req.params.id
    Reporter.findById(_id).then((el)=>{
        res.status(200).send(el)
    }).catch((error)=>{res.status(400).send(error)})
    
});

//Delete by Id
router.delete('/reporter/:id',auth,(req,res)=>{
    const _id= req.params.id
    Reporter.findByIdAndDelete(_id).then((el)=>{
        res.status(200).send(el)
    }).catch((error)=>{res.status(400).send(error)})
    
});

//Delete All
router.delete('/reporters',auth,(req,res)=>{
    Reporter.remove({}).then((el)=>{
        res.status(200).send(el)
    }).catch((error)=>{
        res.status(400).send('Error has been occured'+error)
    })
})

// Token 
router.post('/reporter',async(req,res)=>{
    try{
        const reporter = new Reporter(req.body);
        await reporter.save();
        const token = await reporter.generateToken() ;
        res.status(200).send({reporter,token});
    }
    catch(error){
        res.status(400).send('Error has occured '+ error)
    }
});

// Login
router.post('/reporter/login',async (req,res)=>{
    try{
        const reporter = await Reporter.findByCredentials(req.body.email,req.body.password);
        const token = await reporter.generateToken()
        res.status(200).send({reporter,token});
    }
    catch(error){
        res.status(400).send('Try again' + error)
    }
});

//update
router.patch('/reporter/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body);
    console.log(updates);
    const allowedUpdates = ["name","email","phoneNumber","password"];
    const isValid = updates.every((el)=> allowedUpdates.includes(el));
    if(!isValid){
        return res.status(400).send("can't update");
    }

    const _id = req.params.id;
    try{
        const reporter = await Reporter.findById(_id);
        if(!reporter){
            return res.status(400).send('No user is found');
    }
        console.log(reporter);
        updates.forEach((update)=> reporter[update] = req.body[update]);
        await reporter.save();
        res.status(200).send(reporter);
    }
    catch(error){
        res.status(500).send('Error has occureed ' + error);
    }
});

// Logout

router.delete('/logout',auth,async(req,res)=>{
    try{
        req.reporter.tokens = req.reporter.tokens.filter((el)=>{
            return el.token !== req.token;
        })
        await req.reporter.save();
        res.send('Logout successfuuly');
    }
    catch(error){
        res.send('Error has occurred '+ error);
    }
});

//Logout from All
router.delete('/logoutall',auth,async(req,res)=>{
    try{
        req.reporter.tokens = [];
        await req.reporter.save();
        res.send('Logout all was successfully done');
    }
    catch(error){
        res.send('Error has occurred ' + error);
    }
});


module.exports = router;