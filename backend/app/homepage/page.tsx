import { currentUser } from "@clerk/nextjs/server";
import { getLastResponses } from "../actions/statsActions";
import { UsersResponse } from"@/app/interface/UserResponse"
import QuestionCard from "../components/QuestionCard";
import Image from "next/image";
import Record from "@/app/components/Record";

const page = async () => {
  const user = await currentUser();
  const userName = user?.firstName ?? "";
  const lastQuestions: UsersResponse[] = await getLastResponses(20);
  
  return (
    <div className="flex flex-col items-center justify-between p-10 h-screen">
        <h1 className="text-3xl capitalize font-bold mb-20">Votre Home Page {userName}</h1>
          <Image
            src={"/Questions re 1fy7.svg"}
            width={350}
            height={150}
            alt="Home Image"
            className="block"
          />
          <div className="mt-14">
            <h1 className="text-3xl font-bold my-6">Vos 20 derniers résultats : </h1>
            <div className="grid grid-cols-2 gap-6"> 
             {lastQuestions.map((elem, index) => {
              return(
                <QuestionCard index={index} resp={elem}/>
              )
            })}</div>

          </div>
    </div>
  )
}

export default page