import {useState, useEffect} from 'react';
import axios from 'axios';
import {url} from '../config.ts';
import Loading from './Loading.tsx';
import {Link, useNavigate} from 'react-router-dom';

const Home = () => {
const [sets, setSets] = useState<any[]>([]);
const [loading, setLoading] = useState(false);
const navigate = useNavigate();



useEffect(()=>{
    if(!localStorage.getItem("flashcardsAppUsername")) {
        navigate('/login')
    }
    const getData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${url}`);
            setSets(response.data.sets);
            setLoading(false);
        } catch(e) {
            setLoading(false);
            console.error(e);
        }
    }
    getData();
},[])
  return (
    <div className="p-4 pb-[200px] w-full">
       <Link to='/createSet'><button className="absolute border border-black px-2 py-1 rounded-lg hover:shadow-[0_5px_5px_-5px] hover:bg-gray-200 active:bg-gray-100">Log Out</button></Link>
        <h1 className="text-3xl mb-3 text-center">Flashcards App</h1>
        <div className="flex flex-wrap justify-evenly p-4 mx-auto my-2 border border-black w-[90%] rounded-lg min-w-[310px]">
            {loading ? <Loading /> : sets.map(set=>{
                //console.log(set.owner);
                //console.log(user);
                if (set.owner == localStorage.getItem("flashcardsAppUsername")) {
                return <div className="p-4 rounded-lg border border-black min-w-[250px] max-w-[24%] m-2" key={set._id} style={{backgroundColor:`${set.color}`}}>
                    <h1 className="text-2xl">{set.title}</h1>
                    <h1 className="text-xl">{set.description}</h1>
                    <h1 className="text-xl text-gray">{`${set.cardCount} terms`}</h1>
                    <div className="p-4 flex flex-wrap justify-evenly">
                        <Link to={`/viewSet/${set._id}`}><button className="inline border-2 border-black px-2 py-1 my-1 rounded-lg  hover:shadow-[0_5px_5px_-5px] ">Study Set</button></Link>
                        <Link to={`/editSet/${set._id}`}><button className="inline border-2 border-black px-2 py-1 my-1 ml-2 rounded-lg hover:shadow-[0_5px_5px_-5px] ">Edit Set</button></Link>
                        <Link to={`/deleteSet/${set._id}`}><button className="inline border-2 border-black px-2 py-1 my-1 ml-2 rounded-lg  hover:shadow-[0_5px_5px_-5px] ">Delete Set</button></Link>
                    </div>
                </div>
                }
            }
            )}
        </div>
        <Link to='/createSet'><button className="text-3xl mx-auto block border-2 border-black my-2 px-2 py-3 rounded-lg hover:shadow-[0_5px_5px_-5px] hover:bg-gray-200 active:bg-gray-100 w-[90%]">Create Set</button></Link>
    </div>
  )
}

export default Home