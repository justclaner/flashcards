import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import {Set} from '../models/setModel.js';
import {Card} from '../models/cardModel.js';

router.get('/:setId?/:cardId?',async (req,res)=>{
    try {
    const {setId,cardId} = req.params;
    if (setId && cardId == 0) {return res.status(200).json(
        {
        set: await Set.findById(setId)
        }
    );} 
    if (setId == 0 && cardId) {return res.status(200).json(
        {
        card: await Card.findById(cardId)
        }
    );}
    return res.status(200).json(
        {
            sets: await Set.find({}),
            cards: await Card.find({})
        }
    )
    } catch(e) {
        console.error(e);
        return res.status(500).json({success:false,message:e.message});
    }
})

router.post('/createSet',async (req,res)=>{
    try {
        const {title, description, color} = req.body;
        if (!title) {return res.status(400).json({success:false,message:"Title not provided."})}
        const set = {title:title};
        if (description) {set.description = description;}
        if (color) {set.color = color;}
        const result = await Set.create(set);
        if (!result) {return res.status(500).json({success:false,message:"Something went wrong while accessing the MongoDB database."})}
        return res.status(200).json(result);
    } catch(e) {
        console.error(e);
        return res.status(500).json({success:false,message:e.message});
    }
})

router.post('/createCard',async (req,res)=>{
    try {
        const {word, definition, color, setId} = req.body;
        if (!word || !definition) {return res.status(400).json({success:false,message:"Word and/or definition not provided."})}
        if (!setId || !await Set.exists(
            {_id: new mongoose.Types.ObjectId(setId)}
        )) {
            return res.status(400).json({success:false,message:"Set does not exist."})
        }

        const card = {
            word: word,
            definition: definition,
            setId: setId
        };
        if (color) {card.color = color;}
        const result = await Card.create(card);
        if (!result) {return res.status(500).json({success:false,message:"Something went wrong while accessing the MongoDB database."})}
        return res.status(200).json(result);
    } catch(e) {
        console.error(e);
        return res.status(500).json({success:false,message:e.message});
    }
})

export default router;

