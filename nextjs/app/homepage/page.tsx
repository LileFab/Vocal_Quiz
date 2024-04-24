import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import Button from "../components/ui/Button";
import { get20LastResponses } from "../actions/statsActions";
import { UsersResponse } from"@/app/interface/UserResponse"
import CardForHomepage from "./components/CardForHomepage";


const page = async () => {
  const user = await currentUser();
  const userName = user?.firstName ?? "";
  const lastQuestions: UsersResponse[] = await get20LastResponses();
  
  return (
    <div className="flex flex-col items-center justify-between p-24 h-screen">
        <h1 className="text-3xl capitalize font-bold mb-32">Votre Home Page {userName}</h1>
          <Link href="/questions" passHref>
            <Button text="Faire un Quiz !!!"/>
          </Link>
          <div className="mt-14">
            <h1 className="text-3xl font-bold my-6">Vos 20 derniers résultats : </h1>
            <div className="grid grid-cols-2 gap-6"> 
             {lastQuestions.map((elem, index) => {
              return(
                <CardForHomepage index={index} resp={elem}/>
              )
            })}</div>

          </div>
    </div>
  )
}

export default page