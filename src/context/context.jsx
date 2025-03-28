import { createContext, useState } from "react";
import run from "../config/gemini"

export const Context = createContext();

const ContextProvider =(props)=>{
  
    const [input,setInput] = useState("");
    const [recentPrompt,setRecentPrompt] = useState("");
    const [prevPrompts,setPrevPrompts] = useState([]);
    const [showresult,SetShowresult]=useState(false);
    const [loading,setLoading]=useState(false);
    const [resultdata,setResultdata]=useState("");

   const delayPara=(index,nextword)=>{
     setTimeout(function () {
        setResultdata(prev=>prev+nextword);
     },75*index)

   }

    const onSent = async (prompt)=>{
     
    setResultdata("")
    setLoading(true)
    SetShowresult(true)
    setRecentPrompt(input)
    setPrevPrompts(prev=>[...prev,input])
    const response=await run(input)
    let responseArray= response.split("**");
    let newresponse="";
    for(let i=0; i< responseArray.length;i++)
    {
        if (i===0||i%2 !==1) {
            newresponse += responseArray[i]
        }
        else{
            newresponse += "<b>"+responseArray[i] +"</b>";
        }
    }
    let newrespnse2 = newresponse.split("*").join("</br>")
    let newresponsearray =newrespnse2.split(" ");
    for (let i = 0; i < newresponsearray.length; i++)
         {
        const nextword =newresponsearray[i];
        delayPara(i,nextword+" ")
        
    }
    setLoading(false)
    setInput("")
     

    }

    
    const contextValue={
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showresult,
        loading,
        resultdata,
        input,
        setInput
    }
    return(
        <Context.Provider value={contextValue}>
             {props.children}
        </Context.Provider>
    )
}

export default ContextProvider