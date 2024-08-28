import {useState, useEffect, useRef, MutableRefObject} from 'react';
import { useParams} from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading.tsx';
import {url} from '../config.ts';
// import { GoChevronLeft, GoChevronRight } from "react-icons/go";
// import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
// import { RxShuffle } from "react-icons/rx";
import BackButton from './BackButton.tsx';
import { FcCheckmark, FcCancel } from "react-icons/fc";

const WriteSet = () => {
    const {setId} = useParams();
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [loading,setLoading] = useState(false);
    const [wordList,setWordList] = useState<string[]>([]);
    const [definitionList,setDefinitionList] = useState<string[]>([]);
    const [userInput, setUserInput] = useState("");
    const [inFeedback, setInFeedback] = useState(false);
    // const [currentCard,setCurrentCard] = useState(["",""])
    // const [showFront,setShowFront] = useState(true);
    const [cardIndex,setCardIndex] = useState(0);
    const [wordOnFront, _setWordOnFront] = useState(true);
    const [correct, setCorrect] = useState(0);
    const [incorrect,setIncorrect] = useState(0);
    const textInput = useRef() as MutableRefObject<HTMLInputElement>
    const correctSign = useRef() as MutableRefObject<HTMLDivElement>
    const incorrectSign = useRef() as MutableRefObject<HTMLDivElement>
    const restartMessage = useRef(document.createElement("h1"))
    const defaultRestartMessageTextContent = "Restarting with incorrects";
    const restartMessageDurationSeconds = 3;

    const [newWordList,setNewWordList] = useState<string[]>([]);
    const [newDefinitionList,setNewDefinitionList] = useState<string[]>([]);
    
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

//   useEffect(()=>{
//     console.log(newWordList);
//     console.log(newDefinitionList);
//   },[newWordList])

  const checkAnswer = () => {
    setInFeedback(true);
    if (wordOnFront ? (userInput == definitionList[cardIndex]) : (userInput == wordList[cardIndex])) {
        setCorrect(correct + 1);
        sendFeedback(correctSign,"black",0.5);} 
        else {
           setIncorrect(incorrect + 1);
           sendFeedback(incorrectSign,"red",1.5);
        }
  }

  const sendFeedback = (sign: any,color: string, seconds: number) => {
    sign.current.style.visibility = "visible";
    textInput.current.readOnly = true;
    textInput.current.style.color = color;
    if (sign == incorrectSign) {
        setNewWordList([...newWordList,wordList[cardIndex]]);
        setNewDefinitionList([...newDefinitionList,definitionList[cardIndex]]);
        textInput.current.value = wordOnFront ? definitionList[cardIndex] : wordList[cardIndex];
    }
    setTimeout(()=>{
        sign.current.style.visibility = "hidden";
        textInput.current.readOnly = false;
            textInput.current.value = "";
   

        setInFeedback(false);
        textInput.current.style.color = "black";
        if (cardIndex == wordList.length - 1) {
            textInput.current.readOnly = true;
            restartMessage.current.style.visibility = "visible";
            restartMessage.current.textContent += ".";
            const addDots = setInterval(()=>{
            restartMessage.current.textContent += ".";
            },restartMessageDurationSeconds*1000/5);
            setTimeout(()=>{
                //newWordList state not updated yet for last card
                setWordList((sign == correctSign) ? newWordList : [...newWordList,wordList[cardIndex]]);
                setDefinitionList((sign == correctSign) ? newDefinitionList : [...newDefinitionList,definitionList[cardIndex]]);
                setNewWordList([]);
                setNewDefinitionList([]);
                setCardIndex(0);
                restartMessage.current.style.visibility = "hidden";
                clearInterval(addDots);
                restartMessage.current.textContent = defaultRestartMessageTextContent;
                textInput.current.readOnly = false;
                setCorrect(0);
                setIncorrect(0);
            },restartMessageDurationSeconds*1000)
        } else {
        setCardIndex(cardIndex + 1);
        }
        setUserInput("");
    },seconds*1000)
  }

  return (
    <div className="p-4">
        <BackButton path={`/viewSet/${setId}`}/>
        {loading ? <Loading /> :
        <div className="sm:p-4">
            <div className="text-left w-[60%] mx-auto">
                    <h1 className="text-[48px]">{title}</h1>
                    <h1 className="text-2xl">{description}</h1>
            </div>
            <div className="p-4 border border-black w-[60%] mx-auto">
                <h1 className="text-3xl">{wordList[cardIndex]}</h1>
                <div className="flex justify-between items-center">
                    <h1 className="text-lg">Write the definition:</h1>
                    <div className='flex'>
                        <div style={{visibility:"hidden"}} ref={incorrectSign}><FcCancel className="text-[48px]" /></div>
                        <div style={{visibility:"hidden"}} ref={correctSign}><FcCheckmark className="text-[48px]" /></div>
                    </div>
                </div>
                <input type="text" className='text-3xl w-full border border-black px-2 py-1' 
                placeholder={wordOnFront ? "Write the definition" : "Write the word"} 
                onChange={(e)=>{setUserInput(e.target.value)}}
                onKeyDown={(e)=>{
                    if (e.key == "Enter" && !inFeedback && userInput != "") {
                        checkAnswer();
                    }
                }}
                ref={textInput}
                />
                <h1 className="text-lg">Progress: {`${cardIndex + 1}/${wordList.length}`}</h1>
                <h1 className="text-lg">Correct/Know: {correct}</h1>
                <h1 className="text-lg">Incorrect/Forgot: {incorrect}</h1>
                <h1 className="text-lg text-red-500 invisible" ref={restartMessage}>{defaultRestartMessageTextContent}</h1>
            </div>
        </div>
        }
    </div>
  )
}

export default WriteSet