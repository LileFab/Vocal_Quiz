"use client"

import { UserButton } from "@clerk/nextjs"
import { MdQuiz } from "react-icons/md"
import { useSession } from "@clerk/nextjs"
import Link from "next/link"
import { GoGraph } from "react-icons/go";
import { MdOutlineQuestionMark } from "react-icons/md";



function Navbar() {
    const {isSignedIn} = useSession();
  return (
    <div className="py-5 bg-transparent relative z-10 w-full">
        <div className="flex justify-between w-[90%] max-w-[1450px] mx-auto">
            <Link href={"/homepage"} className="flex gap-4 items-center text-2xl font-bold uppercase">
                <MdQuiz/>
                <h1>Quiz'In</h1>
            </Link>
            <Link href={"/questions"} className="flex gap-4 inset-y-0 right-0 font-bold">
                <MdOutlineQuestionMark className="mt-1"/>
                <h1 className="mb-4">Quiz</h1>
            </Link>
            <Link href={"/statspage"} className="flex gap-4 inset-y-0 right-0 font-bold">
                <GoGraph/>
                <h1>Statistiques</h1>
            </Link>
            <div className="flex">
                <UserButton afterSignOutUrl="/"/>
            </div>
        </div>
    </div>
  )
}

export default Navbar
