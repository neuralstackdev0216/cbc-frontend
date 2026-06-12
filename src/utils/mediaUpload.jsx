import { createClient } from "@supabase/supabase-js"

const url="https://nmqmyklvjewphjpjlqik.supabase.co"
    
const key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcW15a2x2amV3cGhqcGpscWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwODE1NjksImV4cCI6MjA5NjY1NzU2OX0.XrANreVxr6fLWo7yttJSXuoxqkq_pmtxZ-Jjgf7QFIA"

const supabase = createClient(url,key)

export default function mediaUpload(file){

    const mediaUploadPromise = new Promise(
        (resolve,reject)=>{
            if(file == null){
                reject("No file Selected")
                return
            }

            const timestamp = new Date().getTime()
            const newName=timestamp + file.name

            supabase.storage.from("images").upload(newName,file,{
            upsert:false,
            cacheControl:"3600"
            }).then(()=>{
                const publicUrl = supabase.storage.from("images").getPublicUrl(newName).data.publicUrl
                resolve(publicUrl)
            })
            .catch((err)=>{
                reject("Error occured in Supabase connection")
            })


        }
    )

    return mediaUploadPromise
}