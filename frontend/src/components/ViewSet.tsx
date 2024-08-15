import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading.tsx';
import {url} from '../config.ts';

const ViewSet = () => {
  const {setId} = useParams();
  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [loading,setLoading] = useState(false);
  const [wordList,setWordList] = useState<string[]>([]);
  const [definitionList,setDefinitionList] = useState<string[]>([]);
  const [currentCard,setCurrentCard] = useState(["",""])
  const [showFront,setShowFront] = useState(true);
  useEffect(()=>{
    const getData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${url}/${setId}/0`)
            setTitle(response.data.set.title);
            setDescription(response.data.set.description);
            setWordList(response.data.cards.map((card: { word: string; })=>{
                return card.word;
            }))
            setDefinitionList(response.data.cards.map((card: { definition: string; })=>{
                return card.definition;
            }))
            setLoading(false);
        } catch(e) {
            setLoading(false);
            console.error(e);
        }
    }
    getData();
  },[])



  useEffect(()=>{
    setCurrentCard([wordList[0],definitionList[0]])
  },[definitionList])

  return (
    <div className="p-4 text-center w-fit m-auto">
        {loading ? <Loading /> :
        <div className="p-4">
            <div className="text-left">
                <h1 className="text-[48px]">{title}</h1>
                <h1 className="text-2xl">{description}</h1>
            </div>
            <div className="p-[30px] flex items-center text-wrap break-words overflow-scroll justify-center border border-black rounded-lg w-[600px] h-[400px] m-auto">
                <h1 className="text-[48px] max-w-[100%] max-h-[100%]">asdlkfjlasdkfjl;aksdfjlsdfsdfsdfkadsjflkajsdkfdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd</h1>
            </div>
        </div>
        }

    </div>
  )
}

export default ViewSet