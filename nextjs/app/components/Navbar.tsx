"use client"

import { UserButton } from "@clerk/nextjs"
import { MdQuiz } from "react-icons/md"
import { useSession } from "@clerk/nextjs"
import Link from "next/link"

function Navbar() {
    const {isSignedIn} = useSession();
  return (
    <div className="py-5 bg-transparent relative z-10 w-full">
        <div className="flex justify-between w-[90%] max-w-[1450px] mx-auto">
            <Link href={"/"} className="flex gap-4 items-center text-2xl font-bold uppercase">
                <MdQuiz/>
                <h1>Quiz'In</h1>
            </Link>
            <div className="flex">
                <UserButton afterSignOutUrl="/"/>
            </div>
        </div>
    </div>
  )
}

export default Navbar
