import {useState,useEffect, createContext} from 'react';

import Card from './Card.tsx';
import { DiVim } from 'react-icons/di';
export const DataContext = createContext(null as any);
const CreateSet = () => {
  const defaultLength = 3;
  const [wordList,setWordList] = useState<string[]>(["","",""]);
  const [definitionList,setDefinitionList] = useState<string[]>(["","",""]);
  const [cardElements,setCardElements] = useState(new Array(defaultLength).fill(0).map((obj,i)=> 
    <Card key={i} index={i} wordDefault={wordList[i]} definitionDefault={wordList[i]}/>
      ));
  

useEffect(()=>{
  console.log(cardElements);
},[cardElements])

useEffect(()=>{
  console.log("Words: " + wordList);
},[wordList])
useEffect(()=>{
  console.log("Definition: " + definitionList);
},[definitionList])

  return (
    <div className="p-4 pb-[200px]">
      <h1 className="text-3xl text-center">Create a set</h1>

      <div className="p-4 w-[50%] mx-auto">
        <label className="text-3xl">Title:</label>
        <input type="text" className="text-3xl w-full border border-black p-2" />
      </div>
      <div className="p-4 w-[50%] mx-auto">
        <label className="text-3xl">Description:</label>
        <input type="text" className="text-3xl w-full border border-black p-2" />
      </div>
      <div className="p-4 w-[50%] mx-auto">
        <label className="text-3xl">Color:</label>
        <input type="color" className="w-full border border-black h-[54px] p-1" />
      </div>

    <div className="flex flex-col p-4 mt-[100px] w-[80%] border border-black rounded-lg mx-auto min-w-[350px]">
    <DataContext.Provider value={{wordList,setWordList,definitionList,setDefinitionList}}>
      {cardElements}
    </DataContext.Provider>
    </div>
    <button className="block border border-black rounded-lg px-2 py-1 mt-4 text-2xl mx-auto" 
    onClick={()=>{
      setWordList([...wordList,""]);
      setDefinitionList([...definitionList,""])
      const index = cardElements.length;
      setCardElements([...cardElements,
      <Card key={index} index={index} wordDefault={wordList[index]} definitionDefault={wordList[index]}/>
    ])
    }}>Create Another Flashcard</button>
    </div>
  )
}

export default CreateSet