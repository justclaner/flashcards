import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { SnackbarProvider, enqueueSnackbar} from 'notistack';
import axios from 'axios';
import {url} from '../config.ts';
import {Link} from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(()=>{
    if(localStorage.getItem("flashcardsAppUsername")) {
        navigate('/home')
    }
  },[])

  const logUser = async () => {
    try {
        const userData = {
            username: username,
            password: password
        }
        //change this
        const response = await axios.post(`${url}/logUser`,userData)
        
        if (!response) {
            enqueueSnackbar("Something went wrong",{variant:"error"})
            return;
        }
        localStorage.setItem("flashcardsAppUsername",username);
        navigate('/home');
    } catch(e:any) {
        console.error(e);
        enqueueSnackbar(e.response.data.message,{variant: "error"})
    }
  }
  return (
    <div className="p-4">
        <SnackbarProvider transitionDuration={250} autoHideDuration={2000}/>
        <div className="p-4 flex flex-col items-center justify-center h-screen">
        <h1 className="text-[48px] text-center pb-[50px]">Flashcards App</h1>
            <div className="p-4 border border-black rounded-xl">
                {/* <h1 className="p-2 text-3xl">Login</h1> */}
                <div className="p-2 flex flex-col">
                    <label className="text-2xl">Username:</label>
                    <input type="text" className="p-1 text-2xl w-full border border-black" onChange={(e)=>{setUsername(e.target.value)}}/>
                </div>
                <div className="p-2 flex flex-col">
                    <label className="text-2xl">Password:</label>
                    <input type="password" className="p-1 text-2xl w-full border border-black" onChange={(e)=>{setPassword(e.target.value)}}/>
                </div>
                <button className="block mx-auto my-2 px-2 py-1 text-3xl rounded-xl border border-black hover:bg-gray-200 active:bg-gray-100"
                onClick={()=>{logUser()}}
                >Login</button>
                <h1 className="text-sm text-center">Haven't made an account? <Link to='/register'><u><span className="text-sky-500 decoration-sky-500">Register here.</span></u></Link></h1>
            </div>
        </div>
    </div>
  )
}

export default Login