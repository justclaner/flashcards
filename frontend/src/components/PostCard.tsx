import {useState,useEffect, useContext, useRef, MutableRefObject} from 'react';
import {DataCreateContext} from './CreateSet.tsx';
import { FiMenu } from "react-icons/fi";
import {Draggable} from '@shopify/draggable';

interface Props {
    index: number;
    wordDefault: string;
    definitionDefault: string;
}

const PostCard = ({index,wordDefault,definitionDefault}:Props) => {
const handle = useRef() as MutableRefObject<HTMLDivElement>;
const card = useRef() as MutableRefObject<HTMLDivElement>;
const dataContext = useContext(DataCreateContext);
const [cardId, setCardId] = useState(-1);

useEffect(()=>{
    handle.current.onmousedown = (e:any) => {
        card.current.setAttribute('draggable','true');
    }
    handle.current.onmouseup = (e:any) => {
        card.current.setAttribute('draggable','false');
    }
    card.current.ondragend = (e:any) => {
        e.target.setAttribute('draggable','false');
    }
},[])

useEffect(()=>{
    for (let i = 0; i < dataContext.cardElements.length; i++) {
        if (dataContext.cardElements[i].props.index == index) {setCardId(i); break;}
    }
},[dataContext.cardElements])


  return (
    <div className="my-4 p-4 border border-black rounded-lg w-full mx-auto h-fit bg-white" ref={card} 
    onDrag={()=>{
        dataContext.setMoveIds([cardId,dataContext.moveIds[1]]);
        dataContext.setIsDragging(true);
    }}
    onDragOver={(e)=>{e.preventDefault();}}
    onDragEnter={(e)=>{e.preventDefault();}}
    onDrop={()=>{
        dataContext.setMoveIds([dataContext.moveIds[0],cardId]);
        dataContext.setIsDragging(false);
    }}
    >



        <div className="flex justify-between items-center pb-3.5" ref={handle}>
        <h1 className="inline text3xl h-fit">{cardId+1}</h1>
        <div className="inline flex items-center">
            <FiMenu className="mr-4 text-2xl"/>
            <button className="px-2 py-1 border border-black rounded-lg hover:bg-gray-200 active:bg-gray-100"
            onClick={()=>{
                console.log("index:"+index);
                console.log("cardId:"+cardId);
                dataContext.setWordList(dataContext.wordList.filter((word: string,i:number)=>i != cardId))
                dataContext.setDefinitionList(dataContext.definitionList.filter((definition: string,i:number)=>i != cardId))
                dataContext.setCardElements(dataContext.cardElements.filter((element: string,i:number)=>i != cardId))
            }}>Delete</button>
        </div>
        </div>
        <hr className="border-1 border-black mb-5 mx-[-16px]"/>
        <div className="float-left p-2 flex items-center w-[50%]">
        <label className="text-2xl">Word/Phrase:</label>
        <textarea name="" id="" className="text-lg border border-black rounded-lg resize-none ml-3 p-2 w-full" 
        defaultValue={wordDefault} onChange={(e)=>dataContext.setWordList(
            dataContext.wordList.map((word: string,i: number) => {
                if (i == index) {
                    return e.target.value;
                } else {
                    return word;
                }
            })
        )} rows={2}></textarea>
        </div>
        <div className="float-left p-2 flex items-center w-[50%]">
        <label className="text-2xl">Definition:</label>
        <textarea name="" id="" className="text-lg border border-black rounded-lg resize-none ml-3 p-2 w-full" 
        defaultValue={definitionDefault} onChange={(e)=>dataContext.setDefinitionList(
            dataContext.definitionList.map((definition:string,i:number)=>{
                if (i == index) {
                    return e.target.value;
                } else {
                    return definition;
                }
            })
        )} rows={2}></textarea>
        </div>
    </div>
  )
}

export default PostCard