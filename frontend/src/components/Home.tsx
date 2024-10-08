import {useState, useEffect} from 'react';
import axios from 'axios';
import {url} from '../config.ts';
import Loading from './Loading.tsx';
import {Link, useNavigate} from 'react-router-dom';
import {sha256} from 'js-sha256';
import { FaGear } from "react-icons/fa6";

const Home = () => {
const [sets, setSets] = useState<any[]>([]);
const [loading, setLoading] = useState(false);
const [moveIds,setMoveIds] = useState(["-1","-1"]);
const [isDragging,setIsDragging] = useState(false);
const navigate = useNavigate();
const username = localStorage.getItem("flashcardsAppUsername");

useEffect(()=>{
    console.log(sets);
},[sets])
useEffect(()=>{
    if(!localStorage.getItem("flashcardsAppAuthCode")) {
        navigate('/')
    }
    const getData = async () => {
        try {
            setLoading(true);
            //repaste ${url} back later
            //http://localhost:5000/flashcards for testing
            //replace with ${url} later
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

const getLuma = (hex:string) : number => {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    const luma = 0.299*r + 0.587*g + 0.114*b; //constant coefficients must add up to 1
    return luma;
}

// const moveElements = (arr: any[]): any[] => {
//     const elem = arr[moveIds[0]];
//     const newList1 = arr.filter((_obj:any,i:number)=>i != moveIds[0]);
//     const newList2 = [
//       ...newList1.slice(0,moveIds[1]),
//       elem,
//       ...newList1.slice(moveIds[1])
//     ];
//     return newList2;
//   }

useEffect(()=>{
    const dragSets = async () => {
        try {
            if (!isDragging && !moveIds.includes("-1")) {
                setLoading(true);
                await axios.put(`${url}/dragSet/${moveIds[0]}/${moveIds[1]}`);
                setLoading(false);
                location.reload();
            }
        } catch(e:any) {
            setLoading(false);
        }
    }
    dragSets();
}, [moveIds])

  return (
    <div className="p-4 pb-[200px] w-full">
        <div className="flex justify-between items-center">
            <h1 className="text-sm sm:text-xl my-2">Logged in as {username}</h1>
            <Link to="/settings">
                <FaGear className="text-[48px] text-slate-500 duration-500 hover:rotate-180 hover:text-slate-300 active:text-slate-400"/>
            </Link>
        </div>
       <button className="text-sm sm:text-xl absolute border border-black px-2 py-1 rounded-lg hover:shadow-[0_5px_5px_-5px] hover:bg-gray-200 active:bg-gray-100"
       onClick={()=>{
        localStorage.removeItem("flashcardsAppUserId");
        localStorage.removeItem("flashcardsAppUsername");
        localStorage.removeItem("flashcardsAppAuthCode");
        navigate('/')
       }}
       >Log Out</button>
        <h1 className="text-xl sm:text-3xl mb-3 text-center">Flashcards App</h1>
        <div className="flex flex-wrap justify-evenly p-4 mx-auto my-2 border border-black w-[90%] rounded-lg min-w-[290px]">
            
            {loading ? <Loading /> : sets.map(set=>{
                //console.log(set.owner);
                if (sha256(sha256(set.owner)) == localStorage.getItem("flashcardsAppAuthCode")) {
                    
                const buttonTask = {
                    borderColor:(getLuma(set.color) < 50) ? 'white' : 'black'
                }
                return <div className="p-4 rounded-lg border border-black min-w-[250px] max-w-[24%] m-2" key={set._id} 
                style={{backgroundColor:`${set.color}`, color:(getLuma(set.color) < 50)? 'white' : 'black'}}
                draggable={true}
                onDrag={()=>{
                    setMoveIds([set._id,moveIds[1]]);
                    setIsDragging(true);
                }}
                onDragOver={(e)=>{e.preventDefault();}}
                onDragEnter={(e)=>{e.preventDefault();}}
                onDrop={()=>{
                    setMoveIds([moveIds[0],set._id]);
                    setIsDragging(false);
                }}
                >
                    <h1 className="text-2xl">{set.title}</h1>
                    <h1 className="text-xl">{set.description}</h1>
                    <h1 className="text-xl text-gray">{`${set.cardCount} terms`}</h1>
                    <div className="p-4 flex flex-wrap justify-evenly">
                        <Link to={`/viewSet/${set._id}`}><button style={buttonTask} className="inline select-none border-2 border-black px-2 py-1 my-1 rounded-lg  hover:shadow-[0_5px_5px_-5px] ">Study Set</button></Link>

                        <Link to={`/editSet/${set._id}`}><button style={buttonTask} className="inline select-none border-2 border-black px-2 py-1 my-1 ml-2 rounded-lg hover:shadow-[0_5px_5px_-5px] ">Edit Set</button></Link>

                        <Link to={`/deleteSet/${set._id}`}><button style={buttonTask} className="inline select-none border-2 border-black px-2 py-1 my-1 ml-2 rounded-lg  hover:shadow-[0_5px_5px_-5px] ">Delete Set</button></Link>
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