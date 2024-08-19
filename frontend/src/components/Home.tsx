import {useState, useEffect} from 'react';
import axios from 'axios';
import {url} from '../config.ts';
import Loading from './Loading.tsx';
import {Link, useNavigate} from 'react-router-dom';
import {sha256} from 'js-sha256';

const Home = () => {
const [sets, setSets] = useState<any[]>([]);
const [loading, setLoading] = useState(false);
const navigate = useNavigate();
const username = localStorage.getItem("flashcardsAppUsername");


useEffect(()=>{
    if(!localStorage.getItem("flashcardsAppAuthCode")) {
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
        <h1 className="text-xl my-2">Logged in as {username}</h1>
       <button className="absolute border border-black px-2 py-1 rounded-lg hover:shadow-[0_5px_5px_-5px] hover:bg-gray-200 active:bg-gray-100"
       onClick={()=>{
        localStorage.removeItem("flashcardsAppUserId");
        localStorage.removeItem("flashcardsAppUsername");
        localStorage.removeItem("flashcardsAppAuthCode");
        navigate('/login')
       }}
       >Log Out</button>
        <h1 className="text-3xl mb-3 text-center">Flashcards App</h1>
        <div className="flex flex-wrap justify-evenly p-4 mx-auto my-2 border border-black w-[90%] rounded-lg min-w-[310px]">
            {loading ? <Loading /> : sets.map(set=>{
                //console.log(set.owner);
                if (set.owner == localStorage.getItem("flashcardsAppUsername")) {
                    
                return <div className="p-4 rounded-lg border border-black min-w-[250px] max-w-[24%] m-2" key={set._id} style={{backgroundColor:`${set.color}`}}>
                    <h1 className="text-2xl">{set.title}</h1>
                    <h1 className="text-xl">{set.description}</h1>
                    <h1 className="text-xl text-gray">{`${set.cardCount} terms`}</h1>
                    <div className="p-4 flex flex-wrap justify-evenly">
                        <Link to={`/viewSet/${set._id}`}><button className="inline select-none border-2 border-black px-2 py-1 my-1 rounded-lg  hover:shadow-[0_5px_5px_-5px] ">Study Set</button></Link>
                        <Link to={`/editSet/${set._id}`}><button className="inline select-none border-2 border-black px-2 py-1 my-1 ml-2 rounded-lg hover:shadow-[0_5px_5px_-5px] ">Edit Set</button></Link>
                        <Link to={`/deleteSet/${set._id}`}><button className="inline select-none border-2 border-black px-2 py-1 my-1 ml-2 rounded-lg  hover:shadow-[0_5px_5px_-5px] ">Delete Set</button></Link>
                    </div>
                </div>
                }
            }
            )}
        </div>
        <div className="text-center">
        <Link to='/createSet'><button className="select-none text-3xl border-2 grow border-black mx-auto my-2 px-2 py-3 rounded-lg hover:shadow-[0_5px_5px_-5px] hover:bg-gray-200 active:bg-gray-100 w-[90%]">
        Create Set</button></Link>
        </div>
    </div>
  )
}

export default Home