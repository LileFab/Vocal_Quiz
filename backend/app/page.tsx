import Image from "next/image";
import { SignUpButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import Button from "./components/ui/Button";

export default function Home() {
  return (
    <main className="flex-col items-center justify-between p-24">
      <div className="grid grid-cols-2 gap-20 text-center">
        <div className="flex flex-col space-y-8">
          <h1 className="text-3xl pt-20 font-bold pb-20">Bienvenue dans Quiz'In 👋</h1>
          <SignUpButton mode="modal" fallbackRedirectUrl="/homepage"><Button text="Se connecter" type="button" /></SignUpButton>
          <SignInButton mode="modal" fallbackRedirectUrl="/homepage"><Button text="S'inscrire" type="button" /></SignInButton>
        </div>
        <Image
          src={"/welcoming.svg"}
          width={500}
          height={300}
          alt="Welcoming Image"
          className="block"
        />
      </div>
    </main>
  );
}
