import {useState,useEffect, createContext} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Loading from './Loading.tsx';
import Card from './PutCard.tsx';
import axios from 'axios';
import {url} from '../config.ts';
export const DataEditContext = createContext(null as any);
const CreateSet = () => {
  const [wordList,setWordList] = useState<string[]>(["","",""]);
  const [definitionList,setDefinitionList] = useState<string[]>(["","",""]);
  const [cardElements,setCardElements] = useState(new Array(1).fill(0).map((obj,i)=> 
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

useEffect(()=>{
    const getData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${url}/${setId}/0`);
            await setWordList(response.data.cards.map((card: { word: string; })=>{
                return card.word;
            }))
            await setDefinitionList(response.data.cards.map((card: { definition: string; })=>{
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
 setCardElements(new Array(wordList.length).fill(0).map((obj,i)=>
    <Card key={i} index={i} wordDefault={wordList[i]} definitionDefault={definitionList[i]}/>
    ));
},[definitionList])

useEffect(()=>{
  if (!isDragging && !moveIds.includes(-1)) {
    console.log(moveIds);
    setCardElements(moveElements(cardElements));
    setWordList(moveElements(wordList));
    setDefinitionList(moveElements(definitionList));
  }
},[moveIds])

const moveElements = (arr: any[]): any[] => {
  const elem = arr[moveIds[0]];
  const newList1 = arr.filter((obj:any,i:number)=>i != moveIds[0]);
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
    if (wordList.length == 0) {throw "At least one card is required!"}
    for (let i = 0; i < wordList.length; i++) {
      if (wordList[i] == "" || definitionList[i] == "") {throw "Word/definition fields can not be left blank."}
    } 
    setLoading(true);
    const setData = {
      title: title,
      description: description,
      color: color
    }
    await axios.put(`${url}/editSet/${setId}`, setData);
    await axios.delete(`${url}/deleteSetCards/${setId}`);

    for (let i = 0; i < wordList.length; i++) {
      if (wordList[i] == "") {continue;}
      const cardData = {
        word: wordList[i],
        definition: definitionList[i],
        setId: setId
      }
      await axios.post(`${url}/createCard`, cardData);
    }
    setLoading(false);
    navigate('/home');
  } catch(e) {
    setLoading(false);
    console.error(e);
  }
}

  return (
      <div className="p-4 pb-[200px]">
      <h1 className="text-3xl text-center">Create a set</h1>

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
    <button className="block border border-black rounded-lg px-2 py-1 mt-4 text-2xl mx-auto hover:bg-gray-200 active:bg-gray-100" onClick={putFlashcards}>Edit Set</button>
    {loading ? <Loading /> : ""}
    </div>
  )
}

export default CreateSet