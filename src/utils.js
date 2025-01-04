export const isJsonString=(data)=>{
    try{
        JSON.parse(data)
    }catch(error){
        return false
    }
    return true
}

export const convertPrice=(price)=>{
  try{
const result=price?.toLocaleString().replayAll(',','.')
return `${result} VND`
  } catch(error){
    return null
  } 
}