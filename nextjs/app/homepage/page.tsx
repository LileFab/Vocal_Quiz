import { currentUser } from "@clerk/nextjs/server";

const page = async () => {
  const user = await currentUser();
  const userName = user?.firstName ?? "";
  return (
    <div className="flex-col items-center justify-between p-24">
        <h1 className="text-3xl capitalize font-bold">Votre Home Page {userName} 🥵</h1>
    </div>
  )
}

export default page