import {useState,useEffect} from 'react';
import axios from 'axios';
import BackButton from './BackButton.tsx';
import {useNavigate,useParams} from 'react-router-dom';
import Loading from './Loading.tsx';
import {url} from '../config.ts';
import {sha256} from 'js-sha256';

const DeleteSet = () => {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const {setId} = useParams();
    const navigate = useNavigate();
    const authCode = localStorage.getItem("flashcardsAppAuthCode");

    useEffect(()=> {
        const getSet = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${url}/${setId}/0`);
                if (sha256(sha256(response.data.set.owner)) != authCode) {
                    navigate('/home');
                    return;
                }
                setTitle(response.data.set.title);
                setLoading(false);
            } catch(e) {
                setLoading(false);
                console.error(e);
            }
        }
        getSet();
    },[])

    const deleteSet = async () => {
        try {
            setLoading(true);
            const result = await axios.delete(`${url}/deleteSet/${setId}`);
            if (!result) {throw "Something went wrong while accessing the MongoDB database."}
            setLoading(false);
            navigate('/home');
        } catch(e) {
            setLoading(false);
            console.error(e);
        }
    }
  return (
    <div className="p-4">
        <BackButton />
        {loading ? <Loading /> : 
        <div className="p-4 text-center">
            <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full">
                <h1 className="block text-3xl w-fit max-w-[75%] mx-auto my-5">{`Are you sure you want to delete flashcard set ${title}? This action is irreversible.`}</h1>
                <button className="bg-red-200 border border-black px-3 py-1 my-5 mx-auto rounded-lg text-3xl hover:bg-red-400 active:bg-red-300"
                onClick={deleteSet}>{`DELETE ${title}`}</button>
            </div>
        </div>
        }
    </div>
  )
}

export default DeleteSet