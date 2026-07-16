import { useEffect, useState } from "react";

function useAmbientMode() {

    const [enabled,setEnabled]=useState(false);

    useEffect(()=>{

        const savedMode=localStorage.getItem("ambientMode");

        if(savedMode==="true"){

            setEnabled(true);

        }

    },[]);

    function toggleAmbient(){

        const next=!enabled;

        setEnabled(next);

        localStorage.setItem(

            "ambientMode",

            next.toString()

        );

    }

    return{

        enabled,

        toggleAmbient

    };

}

export default useAmbientMode;