
import { useSession, signIn, signOut } from 'next-auth/react';
import Navigation from "@/components/Nav";


export default function Layout({ children }) {
    const { data: session } = useSession();
    if (!session) {
        return (
            <div className="bg-blue-800 w-screen h-screen flex items-center ">
                <div className="text-center w-full">
                    <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-lg">Login with Google</button>

                </div>

            </div>
        )

    }
    return (

        <div className="bg-blue-900 min-h-screen flex">
            <Navigation/>
            <div className="bg-white flex-grow mt-1 mr-1 mb-2 rounded-lg p-4">
                {children}
            </div>
        </div>

    );
}
