import {useState,useEffect, createContext, useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Loading from './Loading.tsx';
import Card from './PutCard.tsx';
import axios from 'axios';
import {url} from '../config.ts';
import BackButton from './BackButton.tsx';
import {sha256} from 'js-sha256';
import { SnackbarProvider, enqueueSnackbar} from 'notistack';
export const DataEditContext = createContext(null as any);


const EditSet = () => {
  const [wordList,setWordList] = useState<string[]>(["","",""]);
  const [definitionList,setDefinitionList] = useState<string[]>(["","",""]);
  const [cardElements,setCardElements] = useState(new Array(1).fill(0).map((_obj,i)=> 
    <Card key={i} index={i} wordDefault={wordList[i]} definitionDefault={definitionList[i]}/>
      ));
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [color, setColor] = useState("#ffffff"); //add default color here
  const {setId} = useParams();

  const [isDragging, setIsDragging] = useState(false);
  const [moveIds,setMoveIds] = useState([-1,-1]);

  const [isImporting, setIsImporting] = useState(false);
  const importPage = useRef<HTMLDivElement>() as any;
  const importTextarea = useRef<HTMLTextAreaElement>() as any;
  const [importText, setImportText] = useState("");

  const authCode = localStorage.getItem("flashcardsAppAuthCode");
useEffect(()=>{
  // console.log(wordList);
  // console.log(definitionList);
  // console.log(cardElements);
},[definitionList])

useEffect(()=>{
    const getData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${url}/${setId}/0`);
            if (sha256(sha256(response.data.set.owner)) != authCode) {
              navigate('/home');
              return;
            }
            setWordList(response.data.cards.map((card: { word: string; })=>{
                return card.word;
            }))
            setDefinitionList(response.data.cards.map((card: { definition: string; })=>{
                return card.definition;
            }))
            setTitle(response.data.set.title);
            setDescription(response.data.set.description);
            setColor(response.data.set.color);
            setLoading(false);
        } catch(e) {
            setLoading(false);
            console.error(e);
        }
    }
    getData();
},[])

useEffect(()=>{
 //if definitionList is updated, wordList must be too
 setCardElements(new Array(wordList.length).fill(0).map((_obj,i)=>
    <Card key={i} index={i} wordDefault={wordList[i]} definitionDefault={definitionList[i]}/>
    ));
},[definitionList])

useEffect(()=>{
  if (!isDragging && !moveIds.includes(-1)) {
    //console.log(moveIds);
    setCardElements(moveElements(cardElements));
    setWordList(moveElements(wordList));
    setDefinitionList(moveElements(definitionList));
  }
},[moveIds])

useEffect(()=>{
  let tempWordList = [];
  let tempDefinitionList = [];
  let seenWord = false;
  let phrase = "";
 const whitespace = new Set([' ', '\t', '\n'])
  for (let i = 0; i < importText.length; i++) {
    let l = importText[i];
    if (whitespace.has(l) && !seenWord) {
      continue;
    } else if (l == '\t' && seenWord) {
      seenWord = false;
      tempWordList.push(phrase);
      phrase = "";
    } else if (l == '\n' && seenWord) {
      seenWord = false;
      tempDefinitionList.push(phrase);
      phrase = "";
    } else {
      seenWord = true
      phrase += l;
    }
  }
  tempDefinitionList.push(phrase);
  if (tempWordList.length > 0) {

  let removeEmptyWords: string[] = [];
  let removeEmptyDefinitions: string[] = [];
  let removeEmptyCards : any[]= [];
  cardElements.map((card,i)=>{
    if (wordList[i] != "" || definitionList[i] != "") {
      removeEmptyCards.push(card);
      removeEmptyWords.push(wordList[i]);
      removeEmptyDefinitions.push(definitionList[i]);
    }
  })
  setWordList([...removeEmptyWords,...tempWordList]);
  setDefinitionList([...removeEmptyDefinitions,...tempDefinitionList]);
  setCardElements([
    ...removeEmptyCards,
    ...tempWordList.map((_obj,i)=>{
    return <Card key={i+removeEmptyCards.length} index={i+removeEmptyCards.length} wordDefault={tempWordList[i]} definitionDefault={(i < tempDefinitionList.length) ? tempDefinitionList[i] : ""}/>
  })])
  }
},[importText])

const moveElements = (arr: any[]): any[] => {
  const elem = arr[moveIds[0]];
  const newList1 = arr.filter((_obj:any,i:number)=>i != moveIds[0]);
  const newList2 = [
    ...newList1.slice(0,moveIds[1]),
    elem,
    ...newList1.slice(moveIds[1])
  ];
  return newList2;
}

const putFlashcards = async () => {
  try {
    if (title == "") {throw "Title required!"}
    if (cardElements.length == 0) {throw "At least one card is required!"}
    for (let i = 0; i < wordList.length; i++) {
      if (wordList[i] == "" || definitionList[i] == "") {throw "Word/definition fields can not be left blank."}
    } 
    setLoading(true);
    const owner = localStorage.getItem(("flashcardsAppUsername"));
    const setData = {
      title: title,
      description: description,
      color: color,
      cardCount: cardElements.length,
      owner: owner
    }
    await axios.put(`${url}/editSet/${setId}`, setData);
    await axios.delete(`${url}/deleteSetCards/${setId}`);

    for (let i = 0; i < wordList.length; i++) {
      const cardData = {
        word: wordList[i],
        definition: definitionList[i],
        setId: setId,
        owner: owner
      }
      await axios.post(`${url}/createCard`, cardData);
    }
    setLoading(false);
    navigate('/home');
  } catch(e:any) {
    setLoading(false);
    enqueueSnackbar(e,{variant: "error"})
  }
}

const handleTab = (e:any) => {
  if (e.key == 'Tab') {
    e.preventDefault();
    const text = importTextarea.current;
    const start = text.selectionStart;
    const end = text.selectionEnd;

    text.value = text.value.substring(0, start) + "\t" + text.value.substring(end);
    text.selectionStart = text.selectionEnd = start + 1;
  }
}

const textareaPlaceholder = "Word 1\tDefinition 1\nWord 2\tDefinition 2\nWord 3\tDefinition 3"

  return (
      <div className="p-4 pb-[200px]">
      <SnackbarProvider transitionDuration={250} autoHideDuration={2000}/>
      <div ref={importPage} className="absolute block bg-white asbsolute left-[-1px] right-[-1px] top-0 p-4 z-10 border border-black rounded-x h-fit"
      style={{
        translate: isImporting ? "0 0" : "0 -100%",
        transition: "0.25s"
      }}
      >
      <button className="block border border-black rounded-lg px-2 py-1 text-2xl hover:bg-gray-200 active:bg-gray-100"
        onClick={()=>{
          setIsImporting(false)
        }}
      >Cancel Import</button>
      <h1 className="text3xl">Paste here</h1>
      <textarea ref={importTextarea} className="block border border-black w-[100%] h-[375px] text-xl px-2 py-1" onKeyDown={(e)=>handleTab.call(this,e)}
        placeholder={textareaPlaceholder}
        ></textarea>
       <div className="w-full flex justify-end">
        <button className="block border border-black rounded-lg px-2 py-1 mt-4 text-3xl hover:bg-gray-200 active:bg-gray-100"
        onClick={()=>{
          setImportText(importTextarea.current.value);
          importTextarea.current.value = "";
          setIsImporting(false);
        }}
        >Import</button>
      </div>
      </div>
        <BackButton />
      <h1 className="text-3xl text-center">Edit a set</h1>

    {loading ? <Loading /> : 
      <div className="p-4 w-[50%] mx-auto">
        <label className="text-3xl">Title:</label>
        <input type="text" className="text-3xl w-full border border-black p-2" defaultValue={title} onChange={(e)=>{setTitle(e.target.value)}}/>
      </div>}

      {loading ? <Loading /> : 
      <div className="p-4 w-[50%] mx-auto">
        <label className="text-3xl">Description:</label>
        <input type="text" className="text-3xl w-full border border-black p-2" defaultValue={description} onChange={(e)=>{setDescription(e.target.value)}}/>
      </div>}

      {loading ? <Loading /> : 
      <div className="p-4 w-[50%] mx-auto">
        <label className="text-3xl">Color:</label>
        <input type="color" className="w-full border border-black h-[54px] p-1" defaultValue={color} onChange={(e)=>{setColor(e.target.value)}}/>
      </div>}
      <div className="px-4 w-[50%] mx-auto">
        <button className="block border border-black rounded-lg px-2 py-1 mt-4 float-left text-2xl mx-auto hover:bg-gray-200 active:bg-gray-100"
        onClick={()=>{
          setIsImporting(true)
        }}
        >Import</button>
        </div>
    {loading ? <Loading /> : 
    <div className="flex flex-col p-4 mt-[100px] w-[80%] border border-black rounded-lg mx-auto min-w-[350px]">
    <DataEditContext.Provider 
    value={{
      wordList,setWordList,
      definitionList,setDefinitionList,
      cardElements,setCardElements,
      isDragging,setIsDragging,
      moveIds,setMoveIds
      }}>
      {cardElements}
    </DataEditContext.Provider>
    <button className="block border border-black rounded-lg px-2 py-1 mt-4 text-2xl mx-auto hover:bg-gray-200 active:bg-gray-100" 
    onClick={()=>{
      setWordList([...wordList,""]);
      setDefinitionList([...definitionList,""])
      const index = cardElements.length;
      setCardElements([...cardElements,
      <Card key={index} index={index} wordDefault={wordList[index]} definitionDefault={definitionList[index]}/>
    ])
    }}>Create Another Flashcard</button>
    </div> }
    <button className="block border border-black rounded-lg px-2 py-1 mt-4 text-2xl mx-auto hover:bg-gray-200 active:bg-gray-100" onClick={putFlashcards}>Update Set</button>
    {loading ? <Loading /> : ""}
    </div>
  )
}

export default EditSet