
import { useSession, signIn, signOut } from 'next-auth/react';
import Navigation from "@/components/Nav";
import { useState } from 'react';
import Logo from './logo';

export default function Layout({ children }) {
    const [showNav, setShowNav] = useState(false);
    const { data: session } = useSession();
    if (!session) {
        return (
            <div className="bg-blue-200 w-screen h-screen flex items-center ">
                <div className="text-center w-full">
                    <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-lg">Login with Google</button>

                </div>

            </div>
        )

    }
    return (
        <div className='bg-bgGray min-h-screen'>
            <div className='flex items-center p-4'>
                <button onClick={() => setShowNav(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24" s
                        trokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                    </svg>

                </button>
                <div className='flex-grow justify-center mr-8'>
                    <Logo />
                </div>

            </div>

            <div className="flex">
                <Navigation show={showNav} />
                <div className="bg-white flex-grow mt-1 mr-1 mb-2 rounded-lg p-4">
                    {children}
                </div>
            </div>

        </div>


    );
}
