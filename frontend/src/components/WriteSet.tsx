import {useState, useEffect, useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading.tsx';
import {url} from '../config.ts';
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
import { RxShuffle } from "react-icons/rx";
import BackButton from './BackButton.tsx';

const WriteSet = () => {
    const {setId} = useParams();
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [loading,setLoading] = useState(false);
    const [wordList,setWordList] = useState<string[]>([]);
    const [definitionList,setDefinitionList] = useState<string[]>([]);
    const [currentCard,setCurrentCard] = useState(["",""])
    const [showFront,setShowFront] = useState(true);
    const [cardIndex,setCardIndex] = useState(0);
    const [wordOnFront, setWordOnFront] = useState(true);

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


  return (
    <div className="p-4">
        <BackButton path={`/viewSet/${setId}`}/>
        {loading ? <Loading /> :
        <div className="sm:p-4">
            <div className="text-left">
                    <h1 className="text-[48px]">{title}</h1>
                    <h1 className="text-2xl">{description}</h1>
            </div>
            <div className="border border-black w-[80%]">

            </div>
        </div>
        }
    </div>
  )
}

export default WriteSet