import {useState, useEffect, useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading.tsx';
import {url} from '../config.ts';
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import BackButton from './BackButton.tsx';

const ViewSet = () => {
  const {setId} = useParams();
  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [loading,setLoading] = useState(false);
  const [wordList,setWordList] = useState<string[]>([]);
  const [definitionList,setDefinitionList] = useState<string[]>([]);
  const [currentCard,setCurrentCard] = useState(["",""])
  const [showFront,setShowFront] = useState(true);
  const [cardIndex,setCardIndex] = useState(0);
  const card = useRef<HTMLDivElement>() as any;
  const flipDuration = Number(getComputedStyle(document.body).getPropertyValue('--flip-duration').slice(0,-1)) //seconds
  const slideDuration = Number(getComputedStyle(document.body).getPropertyValue('--slide-duration').slice(0,-1))

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
    setCurrentCard([wordList[cardIndex],definitionList[cardIndex]])
    console.log(getComputedStyle(document.body).getPropertyValue('--slide-duration'));
  },[definitionList])

  useEffect(()=>{
    setCurrentCard([wordList[cardIndex],definitionList[cardIndex]])
  },[cardIndex])

  useEffect(()=>{
  },[currentCard])

  return (
    <div className="p-4">
        <BackButton/>
        <div className="p-4 text-center w-fit m-auto select-none">
            
            {loading ? <Loading /> :
            <div className="p-4">
                <div className="text-left">
                    <h1 className="text-[48px]">{title}</h1>
                    <h1 className="text-2xl">{description}</h1>
                </div>
                <div className="p-[30px] flex items-center text-wrap break-words overflow-auto justify-center border border-black rounded-xl w-[600px] h-[400px] m-auto"
                    onClick={()=>{
                        console.log(flipDuration);
                        card.current.classList.add("flipAnimation")
                        setTimeout(()=>{
                            setShowFront(!showFront);
                        },flipDuration*1000/2)
                        setTimeout(()=>{
                            card.current.classList.remove("flipAnimation");
                        },flipDuration*1000)
                    }}
                    ref={card}>
                    <h1 className="text-[48px] max-w-[100%] max-h-[100%] select-text">{showFront ? currentCard[0] : currentCard[1]}</h1>
                </div>
                <div className="p-4 flex justify-between items-center">
                <button className="inline  border border-black text-[48px] rounded-[50%]" onClick={()=>{
                    if (cardIndex > 0) {
                        card.current.classList.add("slideRight")
                        setTimeout(()=>{
                        setCardIndex(cardIndex - 1);
                        setShowFront(true);
                        },slideDuration*1000/2)
                        setTimeout(()=>{
                        card.current.classList.remove("slideRight")
                        },slideDuration*1000)
                    }
                    }}><GoChevronLeft /></button>
                <h1 className="text-3xl">{`${cardIndex + 1}/${wordList.length}`}</h1>
                <button className="inline float-right border border-black text-[48px] rounded-[50%]" onClick={()=>{
                    if (cardIndex < wordList.length - 1) {
                        card.current.classList.add("slideLeft")
                        setTimeout(()=>{
                        setCardIndex(cardIndex + 1);
                        setShowFront(true);
                        },slideDuration*1000/2)
                        setTimeout(()=>{
                        card.current.classList.remove("slideLeft")
                        },slideDuration*1000)
                    }
                    }}><GoChevronRight /></button>
                </div>
            </div>
            }
        </div>
    </div>
  )
}

export default ViewSet