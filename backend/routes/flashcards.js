import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import {Set} from '../models/setModel.js';
import {Card} from '../models/cardModel.js';
import {User} from '../models/userModel.js';


router.post('/createUser', async (req,res)=> {
    try {
        const {username,password} = req.body;
        const findUser = await User.find({username:username})
        if (findUser.length != 0) {return res.status(405).json({success:false,message:"This username already exists"});}

        const userData = {
            username: username,
            password: password
        }

        const result = await User.create(userData);
        if (!result) {return res.status(500).json({success:false,message:"Something went wrong while accessing the MongoDB database."})}
        return res.status(200).json({success:true,message:"User successfully created!",result:result})
    } catch(e) {
        console.error(e);
        return res.status(500).json({success:false,message:e.message});
    }
})

router.post('/logUser', async (req,res)=> {
    try {
        const {username,password} = req.body;
        if (!username || !password) {return res.status(404).json({success:false,message:"Both username and password must be provided."})}
        const findUser = await User.find({username:username})
        if (findUser.length == 0) {return res.status(404).json({success:false,message:"Username incorrect or not found."})}
        if (findUser[0].password != password) {return res.status(401).json({success:false,message:"Password incorrect."})}
        return res.status(200).json({success:true,message:"Successfully logged in with correct username and password."})

    } catch(e) {
        console.error(e);
        return res.status(500).json({success:false,message:e.message});
    }
})

router.put('/editUser/:userId', async (req,res)=> {
    try {
        const {userId} = req.params;
        const {username,password} = req.body;
        const findUser = await User.find({username:username})
        if (findUser.length != 0) {return res.status(405).json({success:false,message:"This username already exists"});}

        const userData = {}
        if (username) {userData.username = username;}
        if (password) {userData.password = password;}

        const result = await User.findByIdAndUpdate(userId,userData);
        if (!result) {return res.status(500).json({success:false,message:"Something went wrong while accessing the MongoDB database."});}
        return res.status(200).json({success:true,message:"User successfully created!",result:result});
    } catch(e) {
        console.error(e);
        return res.status(500).json({success:false,message:e.message});
    }
})

router.delete('/deleteUser/:userId', async (req,res)=> {
    try {
        const {userId} = req.params;
        const deleteUser = await User.findByIdAndDelete(userId);
        if (!deleteUser) {return res.status(500).json({success:false,message:"Something went wrong while accessing the MongoDB database."});}
        return res.status(200).json({success:true,message:"User successfully Deleted"});
    } catch(e) {
        console.error(e);
        return res.status(500).json({success:false,message:e.message});
    }
})


router.get('/:setId?/:cardId?',async (req,res)=>{
    try {
    const {setId,cardId} = req.params;
    if (setId && cardId == 0) {return res.status(200).json(
        {
        set: await Set.findById(setId),
        cards: await Card.find({setId:setId})
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

router.post('/createSet', async (req,res)=>{
    try {
        const {title, description, color, cardCount} = req.body;
        if (!title) {return res.status(400).json({success:false,message:"Title not provided."})}
        const set = {
            title:title,
            cardCount:cardCount
        };
        if (description) {set.description = description;}
        if (color) {set.color = color;}
        const result = await Set.create(set);
        if (!result) {return res.status(500).json({success:false,message:"Something went wrong while accessing the MongoDB database."})}
        return res.status(200).json({success:true,message:"Set successfully uploaded to MongoDB",result:result});
    } catch(e) {
        console.error(e);
        return res.status(500).json({success:false,message:e.message});
    }
})

router.post('/createCard', async (req,res)=>{
    try {
        const {word, definition, setId} = req.body;
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
        const result = await Card.create(card);
        if (!result) {return res.status(500).json({success:false,message:"Something went wrong while accessing the MongoDB database."})}
        return res.status(200).json({success:true,message:"Card successfully uploaded to MongoDB",result:result});
    } catch(e) {
        console.error(e);
        return res.status(500).json({success:false,message:e.message});
    }
})

router.put('/editSet/:setId', async (req,res) => {
    try {
        const {setId} = req.params;
        const {title, description, color, cardCount} = req.body;
        if (!title) {return res.status(400).json({success:false,message:"Title not provided."})}

        const result = await Set.findByIdAndUpdate(setId,req.body);
        if (!result) {return res.status(500).json({success:false,message:"Something went wrong while accessing the MongoDB database."})}
        return res.status(200).json({success:true,message:"Set successfully updated",previous:result});
    } catch(e) {
        console.error(e);
        return res.status(500).json({success:false,message:e.message});
    }
})

router.put('/editCard/:cardId', async (req,res) => {
    try {
        const {cardId} = req.params;
        const {word, definition, color, setId} = req.body;
        if (!word || !definition) {return res.status(400).json({success:false,message:"Word and/or definition not provided."})}

        const result = await Card.findByIdAndUpdate(cardId,req.body);
        if (!result) {return res.status(500).json({success:false,message:"Something went wrong while accessing the MongoDB database."})}
        return res.status(200).json({success:true,message:"Card successfully updated",previous:result});
    } catch(e) {
        console.error(e);
        return res.status(500).json({success:false,message:e.message});
    }
})

router.delete('/deleteSet/:setId', async (req,res) => {
    try {
        const {setId} = req.params;

        const deleteSet = await Set.findByIdAndDelete(setId);
        if (!deleteSet) {return res.status(404).json({success:false, message:"Set is not found."});}

        const deleteCards = await Card.deleteMany({setId:setId});
        if (!deleteCards) {return res.status(404).json({success:false,message:"Cards not found."});}

        return res.status(200).json({success:true,message:"Set successfully deleted.",set:deleteSet,cards:deleteCards});

    } catch(e) {
        console.error(e);
        return res.status(500).json({success:false,message:e.message});
    }
})

router.delete('/deleteSetCards/:setId', async (req,res) => {
    try {
        const {setId} = req.params;
        const deleteCards = await Card.deleteMany({setId:setId});
        if (!deleteCards) {return res.status(404).json({success:false,message:"Cards not found."});}
        return res.status(200).json({success:true,message:"Cards in the set successfully deleted.",cards:deleteCards});
    } catch(e) {
        console.error(e);
        return res.status(500).json({success:false,message:e.message})
    }
})

router.delete('/deleteCard/:cardId', async (req,res) => {
    try {
        const {cardId} = req.params;
        const result = await Card.findByIdAndDelete(cardId);
        if (!result) {return res.status(404).json({success:false, message:"Set is not found."});}
        return res.status(200).json({success:true,message:"Card successfully deleted.",result:result});
    } catch(e) {
        console.error(e);
        return resizeBy.status(500).json({success:false,message:e.message});
    }
})

router.delete('/deleteAll',async (req,res) => {
    try {
        const deleteSets = await Set.deleteMany({});
        const deleteCards = await Card.deleteMany({});
        return res.status(200).json("Deleted everything successfully.")
    } catch(e) {
        console.error(e);
        return resizeBy.status(500).json({success:false,message:e.message});
    }
})

export default router;

