const express = require('express');
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//route 1 get all the notes usinug GET Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
})





//route 2 post the notes usinug POST Login required
router.post("/addnote", fetchuser, [
    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description', 'enter a description with min 5 characters').isLength({ min: 5 }),
    
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() });
    }
    try {
        const {title,description, tag}=req.body;
        const notes = await Notes.create({
            title,
            description,
            tag,
            user: req.user.id
        })
        res.json(notes);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
    
})

//route 3 update aann existingg note usinug PUT Login required

router.put("/updatenote/:id", fetchuser , async (req, res) => {
    try {
        
        const {title,description, tag}=req.body;
        const newNote={};
        if(title) newNote.title=title;
        if(description) newNote.description=description;
        if(tag) newNote.tag=tag;
        const note= await Notes.findById(req.params.id); 
        if(!note){
            res.status(404).send("note not found");
        }
        if(note.user.toString()!==req.user.id){
            res.status(401).send("not authorized");
            
        }
        
        const updatedNote=await Notes.findByIdAndUpdate(req.params.id, {$set:newNote},{new:true});
        
        res.json({updatedNote,message:"Note Updated Succesfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
    
})

// route 4 delete a specific note using note id but login is required
router.delete("/deletenote",fetchuser,async (req,res)=>{
    try{
        const note= await Notes.findById(req.query.id);
        
        if(!note){
            res.status(404).send("note not found");
        }
        if(note.user.toString()!==req.user.id){
            res.status(401).send("not authorized");
            
        }
        const deletedNote= await Notes.findByIdAndDelete(req.query.id);
        return res.json({deletedNote,message:"note deleted successfully"})
    }catch (error) {
        res.status(500).json({error: error.message});
    }
})

//route 5 get specific note usinug GET Login required
router.get("/fetchspecificnote", fetchuser, async (req, res) => {
  try {
      const note = await Notes.findById(req.query.id);
      
      if(!note){
          res.status(404).send("note not found");
      }
      if(note.user.toString()!==req.user.id){
          res.status(401).send("not authorized");
      }
      
      res.json(note);
      
  } catch (error) {
      res.json({error})
  }
})

//searching a note on the basis of title 
router.get("/searchnote/:data", fetchuser, async (req, res) => { 
    try { 
        const data = req.params.data 
        
        let notes = await Notes.find({user: req.user.id})
        
        if(!notes){
            res.status(404).json({error:"note with such user not found"})
        }
       
        notes= notes.filter((note)=>(note.title.includes(data))||note.tag.includes(data)) 
        if(notes.length===0){
            res.status(404).json({error:"no note found"})

        }
        return res.json({notes}); 
    } catch(e){ 
        return res.json(e.message) 
    } 
});

module.exports = router;
