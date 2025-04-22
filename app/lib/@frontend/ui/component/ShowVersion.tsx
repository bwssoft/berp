import {config} from "../../../../lib/config"
export function ShowVersion(){
  return(
   <div className="font-extralight justify-center m-auto">
    <p>Versão 0.0.1</p>
    {/* <p>{config.BCUBE_VERSION}</p> */}
   </div> 
  )
}