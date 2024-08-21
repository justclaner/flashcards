import {useState, useEffect} from 'react';
import {sha256} from 'js-sha256';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {url} from '../config.ts';
import BackButton from './BackButton.tsx';
import Loading from './Loading.tsx';

const Settings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem("flashcardsAppUserId");
    const username = localStorage.getItem("flashcardsAppUsername");
    const authCode = localStorage.getItem("flashcardsAppAuthCode");
    const [newUsername, setNewUsername] = useState(username);
    useEffect(()=>{
        if(!authCode || sha256(sha256(username as any)) != authCode) {
            navigate('/login');
          }
    },[])

    useEffect(()=>{
        console.log(newUsername);
    },[newUsername])

    const putUsername = async () => {
        try {
            if (newUsername == username) {return;}
            setLoading(true);
            await axios.put(`${url}/editUsername/${userId}`,{oldUsername:username,newUsername:newUsername});
            localStorage.removeItem("flashcardsAppUserId");
            localStorage.removeItem("flashcardsAppUsername");
            localStorage.removeItem("flashcardsAppAuthCode");
            setLoading(false);
            navigate('/login');
        } catch(e:any) {
            setLoading(false);
            console.log(e.response.data.message);
        }
    }

    return (
        <div className="p-4">
            <BackButton />
            <h1 className="text-center text-3xl">User Settings</h1>
            <div className="p-4 w-[95%] md:w-[50%] mx-auto border border-black">
                <div className="flex justify-between items-center py-2">
                    <div>
                        <label className="text-xl">Current username:</label>
                        <input type="text" className="ml-2 px-2 text-xl w-[100%] md:w-[175px] focus:border focus:border-black" defaultValue={username!} 
                        onChange={(e)=>{setNewUsername(e.target.value);}}
                        />
                    </div>
                    <button className="border border-black ml-2 px-2 py-1 text-xl rounded-xl hover:bg-gray-200 active:bg-gray-100">Change Username</button>
                </div>
                <div className="flex justify-end items-center py-2">
                    <button className="border border-black ml-2 px-2 py-1 text-xl rounded-xl hover:bg-gray-200 active:bg-gray-100">Change Password</button>
                </div>
                <button className="border border-black mx-auto block text-xl rounded-xl px-2 py-1 hover:bg-gray-200 active:bg-gray-100" onClick={()=>{putUsername()}}>Save</button>
            </div>
            {loading ? <Loading /> : ""}
        </div>
    )
}

export default Settings