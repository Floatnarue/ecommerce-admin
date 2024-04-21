import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth/next";

import GoogleProvider from "next-auth/providers/google";

const adminEmails = ['naroebordin@gmail.com'] ;


export const authOption = {
    providers: [

        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }), 


        

    ],
    adapter : MongoDBAdapter (clientPromise) , 
    // set who enable to login  using callbacks session 
    callbacks : {
        session : ({session, token , user }) => {
            // check if we have session user  ?

            if (adminEmails.includes(session?.user?.email)) {
                // check if it's admin emails ? 
                return session ;     
            }

            else {
                return false ; 
                
            }
            
        },
    
    }
}

export default NextAuth(authOption);



export async function isAdminRequest (req,res) {
    const session = await getServerSession(req,res,authOption) ;
    if (!adminEmails.includes(session?.user?.email)) {

        // throw http error code 
        res.status(401)
        res.end()
        //throw error when the session was logout !! 

        throw "not admin!!" ;
    }
   
}
