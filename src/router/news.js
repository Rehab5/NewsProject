const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const News = require("../models/news");

// Post
router.post("/news", auth, async (req, res) => {
    try {
    const news = new News({
        ...req.body,
        owner: req.reporter._id,
    });
    await news.save()
    res.status(200).send(news);
    } 
    catch (error) {
    res.status(400).send(error);
    }
});

// get all

router.get("/news", auth, async (req, res) => {
    try {
    await req.reporter.populate("news");
    res.send(req.reporter.news);
    } catch (error) {
    res.status(500).send("error " + error);
    }
});

// get by id
router.get("/news/:id", auth, async (req, res) => {
    try {
    const _id = req.params.id;               
    const news = await News.findOne({ _id, owner: req.reporter._id });
    if (!news) {
        return res.status(400).send("No task is found");
    }
    res.send(news);
    } catch (error) {
    res.status(500).send("Error has occurred" + error);
    }
});

// update by id
router.patch("/news/:id", auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ["completed"];
        let isValid = updates.every((update) => allowedUpdates.includes(update));
        if (!isValid) {
            return res.status(400).send("Can't update");
        }
        const _id = req.params.id;
        const news = await News.findOne({ _id, owner: req.reporter._id });
        if (!news) {
            return res.status(404).send("Not found");
        }
        updates.forEach((update) => (news[update] = req.body[update]));
        await news.save();
        res.send(news);

    } catch (error) {
    res.status(400).send("Error has occurred " + error);
    }
});

// delete by id
router.delete("/news/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const news = await News.findOneAndDelete({ _id, owner: req.reporter._id });
        if (!news) {
        return res.status(404).send("Not found");
        }
        res.send(news);
    } catch (error) {
    res.status(500).send("Error has occurred " + error);
    } 
});

//Delete All
router.delete('/news',auth,(req,res)=>{
    News.remove({owner:req.reporter._id}).then((el)=>{
        res.status(200).send(el)
    }).catch((error)=>{
        res.status(400).send(error)
    })
})

module.exports = router;
