import mongoose from 'mongoose';

const cardSchema = mongoose.Schema(
    {
        word: {
            type: String,
            required: true
        },
        definition: {
            type: String,
            required: true
        },
        setId: {
            type: String,
            required: true
        },
        owner: {
            type: String,
            required: true
        }
    },
    {
        timestamps:true
    }
)

export const Card = mongoose.model("Card", cardSchema);