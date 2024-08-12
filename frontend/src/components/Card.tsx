import {useContext} from 'react';
import {DataContext} from './CreateSet.tsx';

interface Props {
    index: number;
    wordDefault: string;
    definitionDefault: string;
}

const Card = ({index,wordDefault,definitionDefault}:Props) => {

const dataContext = useContext(DataContext);

  return (
    <div className="my-4 p-4 border border-black rounded-lg w-full mx-auto h-fit">
        <div className="flex justify-between items-center pb-3.5">
        <h1 className="inline text3xl h-fit">{index+1}</h1>
        <button className="inline float-right px-2 py-1 border border-black rounded-lg">Delete</button>
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

export default Card