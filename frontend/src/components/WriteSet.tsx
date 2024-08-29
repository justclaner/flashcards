import {useState, useEffect, useRef, MutableRefObject} from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading.tsx';
import {url} from '../config.ts';
// import { GoChevronLeft, GoChevronRight } from "react-icons/go";
// import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
// import { RxShuffle } from "react-icons/rx";
import BackButton from './BackButton.tsx';
import { FcCheckmark, FcCancel } from "react-icons/fc";
import { FaGear } from 'react-icons/fa6';

const WriteSet = () => {
    const {setId} = useParams();
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [loading,setLoading] = useState(false);
    const [wordList,setWordList] = useState<string[]>([]);
    const [definitionList,setDefinitionList] = useState<string[]>([]);
    const [wordCount, setWordCount] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [inFeedback, setInFeedback] = useState(false);
    // const [currentCard,setCurrentCard] = useState(["",""])
    // const [showFront,setShowFront] = useState(true);
    const [cardIndex,setCardIndex] = useState(0);
    const [wordOnFront, setWordOnFront] = useState(true);
    const [correct, setCorrect] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [incorrect,setIncorrect] = useState(0);
    const [percentages, setPercentages] = useState<number[]>([]);
    const [completed, setCompleted] = useState(false);
    const [inSettings, setInSettings] = useState(false);
    //const textInput = useRef() as MutableRefObject<HTMLInputElement>
    const textInput = useRef() as MutableRefObject<HTMLTextAreaElement>
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
            setWordCount(response.data.set.cardCount);
            setLoading(false);
        } catch(e) {
            setLoading(false);
            console.error(e);
        }
    }
    getData();
    resizeTextArea();
  },[])

//   useEffect(()=>{
//     console.log(newWordList);
//     console.log(newDefinitionList);
//   },[newWordList])

useEffect(()=>{
    resizeTextArea();
},[userInput])

useEffect(()=>{
console.log(percentages);
},[percentages])

const resizeTextArea = () => {
    textInput.current.style.height = "1px";
    textInput.current.style.height = (textInput.current.scrollHeight) + "px";
}

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
        resizeTextArea();
    }
    setTimeout(()=>{
        sign.current.style.visibility = "hidden";
        textInput.current.readOnly = false;
            textInput.current.value = "";
   

        setInFeedback(false);
        textInput.current.style.color = "black";
        //states not updated yet
        if (cardIndex == wordList.length - 1) {
            if (sign == correctSign && incorrect == 0) {
                setCompleted(true);
                setPercentages([...percentages,1]);
            } 
            else {
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
                
                setTotalCorrect((sign == correctSign) ? correct + 1 : correct);
                setTotalCorrect(correct);
                setPercentages([...percentages,(sign == correctSign) ? (totalCorrect+correct+1)/wordCount : (totalCorrect+correct)/wordCount]);
                setCorrect(0);
                setIncorrect(0);
            },restartMessageDurationSeconds*1000)
        }
        } else {
        setCardIndex(cardIndex + 1);
        }
        setUserInput("");
    },seconds*1000)
  }


  return (
    <div className="p-4">
        <div className="absolute block bg-white left-0 right-0 top-0 bottom-0 p-4 z-10 border border-black flex flex-col justify-center items-center z-1"
        style={{
            translate: completed ? "0 0" : "0 -100%",
            transition: "0.25s"
        }}>
            <h1 className="text-3xl">Good job!</h1>
            <div className="flex">
                {percentages.map((p,i) => 
                <div className='mx-2 text-center' key={`score-${i}`}>
                    <div className="text-xl">{`Attempt ${i+1}`}</div>
                    <div className="text-lg">{`${(p*100).toFixed(2)}%`}</div>
                </div>
                )}
        </div>
    

            <Link to={'/home'}><button  className="inline select-none border-2 border-black px-2 py-1 my-1 ml-2 rounded-lg hover:shadow-[0_5px_5px_-5px] ">Back to Home</button></Link>
        </div>
        <div className="absolute block bg-white left-0 top-0 h-fit w-fit p-4 z-10 border border-black z-2 flex justify-center items-center"
        style={{
            translate: inSettings ? "0 0" : "0 -100%",
            transition: "0.25s"
        }}
        >
        <button className="block mx-auto inline select-none border-2 border-black px-2 py-1 my-1 rounded-lg hover:shadow-[0_5px_5px_-5px]"
        onClick={()=>{setWordOnFront(!wordOnFront)}}>
            {`Set word on ${wordOnFront ? "back" : "front"}`}
            </button>
        </div>
        <div className="flex justify-between items-center">
            <BackButton path={`/viewSet/${setId}`}/>
            <button 
            onClick={()=>{
                setInSettings(!inSettings);
            }}>
                <FaGear className="text-[48px] text-slate-500 duration-500 hover:rotate-180 hover:text-slate-300 active:text-slate-400"/>
            </button>
        </div>
        {loading ? <Loading /> :
        <div className="sm:p-4">
            <div className="text-left w-[60%] mx-auto">
                    <h1 className="text-[48px]">{title}</h1>
                    <h1 className="text-2xl">{description}</h1>
            </div>
            <div className="p-4 border border-black w-[90%] sm:w-[60%] mx-auto">
                <h1 className="text-3xl">{wordOnFront ? wordList[cardIndex] : definitionList[cardIndex]}</h1>
                <div className="flex justify-end items-center">
                    <div className='flex'>
                        <div style={{visibility:"hidden"}} ref={incorrectSign}><FcCancel className="text-[48px]" /></div>
                        <div style={{visibility:"hidden"}} ref={correctSign}><FcCheckmark className="text-[48px]" /></div>
                    </div>
                </div>
                <textarea className='text-xl w-full border border-black rounded-lg px-2 py-1 w-fit overflow-hidden resize-none min-h-[40px] h-[40px]' 
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