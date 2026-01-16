import mongoose from "mongoose";


export const dbConnect = async()=>{
      try{
         const instance = await mongoose.connect(process.env.MONGODB_URL)
         console.log(`Mongodb connected ${instance.connection.host}`)
      }
      catch(error){
           console.log(error)
      }
}