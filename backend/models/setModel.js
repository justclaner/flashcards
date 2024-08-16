import mongoose from 'mongoose';

const setSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        color: {
            type: String,
            required: false
        },
        cardCount: {
            type: Number,
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

export const Set = mongoose.model("Set", setSchema);