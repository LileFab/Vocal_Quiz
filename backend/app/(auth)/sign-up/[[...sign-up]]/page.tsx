import { SignUp } from "@clerk/nextjs"

const page = () => {
  return (
    <div className="dark:bg-gray-800 h-screen flex justify-center items-center">
        <SignUp/>
    </div>
  )
}

export default page