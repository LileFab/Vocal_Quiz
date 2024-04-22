import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import Button from "../components/ui/Button";

const page = async () => {
  const user = await currentUser();
  const userName = user?.firstName ?? "";
  return (
    <div className="flex flex-col items-center justify-between p-24">
        <h1 className="text-3xl capitalize font-bold mb-32">Votre Home Page {userName} 🥵</h1>
          <Link href="/questions" passHref>
            <Button text="Faire un Quiz !!!"/>
          </Link>
    </div>
  )
}

export default page