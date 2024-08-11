import {useState, useEffect} from 'react';
import axios from 'axios';
import {url} from '../config.ts';
import Loading from './Loading.tsx';
import {Link} from 'react-router-dom';

const Home = () => {
const [sets, setSets] = useState<any[]>([]);
const [cards, setCards] = useState<any[]>([]);
const [loading, setLoading] = useState(false);
useEffect(()=>{
    const getData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${url}`);
            setSets(response.data.sets);
            setCards(response.data.cards);
            setLoading(false);
        } catch(e) {
            setLoading(false);
            console.error(e);
        }
    }
    getData();
},[])
  return (
    <div className="p-4 w-full text-center">
        <h1 className="text-3xl mb-3">Flashcards App</h1>
        <div className="flex flex-wrap justify-evenly p-4 m-auto border border-black w-[90%] rounded-lg">
            {loading ? <Loading /> : sets.map(set=>{
                return <div className="p-4 rounded-lg border border-black min-w-[200px] max-w-[24%] m-2">
                    <h1 className="text-2xl">{set.title}</h1>
                    <h1 className="text-xl">{set.description}</h1>
                    <div className="p-4 flex flex-wrap justify-evenly">
                        <button className="inline border-2 border-black px-2 py-1 rounded-lg  hover:shadow-[0_5px_5px_-5px] hover:bg-gray-200 active:bg-gray-100">Study Set</button>
                        <button className="inline border-2 border-black px-2 py-1 ml-2 rounded-lg hover:shadow-[0_5px_5px_-5px] hover:bg-gray-200 active:bg-gray-100">Edit Set</button>
                        <button className="inline border-2 border-black px-2 py-1 ml-2 rounded-lg  hover:shadow-[0_5px_5px_-5px] hover:bg-gray-200 active:bg-gray-100">Delete Set</button>
                    </div>
                </div>
            })}
        </div>
    </div>
  )
}

export default Home