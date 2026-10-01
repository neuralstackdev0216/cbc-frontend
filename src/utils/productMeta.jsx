export const categories=[
    {name:"Smartphones",icon:"📱"},
    {name:"Tablets",icon:"🖥️"},
    {name:"Smartwatches",icon:"⌚"},
    {name:"Earbuds",icon:"🎧"},
    {name:"chargers",icon:"🔌"},
    {name:"Cases",icon:"🛡️"},
    {name:"Accessories",icon:"🔧"}
]

export const categoryNames=categories.map((c)=>c.name)

export const brands=["Apple","Samsung","Xiaomi","Huwawei","Oppo","Vivo","Realme","OnePlus","Google","Sony","Anker","Other"]

export function parseSpecs(text){
    return text
       .split("\n")
       .filter((line)=>line.includes(":"))
       .map((line)=>({
        label:line.split(":")[0].trim(),
        value:line.split(":").slice(1).join(":").trim()
       }))
       .filter((s)=>s.label && s.value)
}

export function specsToText(specs){
    return (specs || []).map((s)=>s.label + ": "+s.value).join("\n") 
}