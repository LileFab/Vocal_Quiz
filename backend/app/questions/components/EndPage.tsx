import { motion } from "framer-motion"
import Link from "next/link"
import Button from "@/app/components/ui/Button"
import { UsersResponse } from "@/app/interface/UserResponse"
import QuestionCard from "@/app/components/QuestionCard";
import { useEffect, useState, useRef } from "react";
import { getLastResponses } from "@/app/actions/statsActions";
import { updateAverageScoreForUser } from "@/app/actions/usersActions"

const EndPage = ({userName, bonneRep, srcImage} : {userName: string, bonneRep: number, srcImage: string}) => {

    const [res, setRes] = useState<UsersResponse[]>([]);
    const isFirstRun = useRef(true); // Utilisation d'une référence ref pour suivre la première exécution

    useEffect (() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            const get10LastResp = async () => {
                const newRes = await getLastResponses(10) as UsersResponse[];
                setRes(newRes);
            };
            updateAverageScoreForUser()
            get10LastResp();
        }
    }, []);

    if(bonneRep < 4)
    {
        srcImage = "/triste.png";
    }
    else if(bonneRep >= 4 && bonneRep < 7)
    {
        srcImage = "/neutre.png";
    }
    else if(bonneRep >= 7 && bonneRep <= 8)
    {
        srcImage = "/smiley.png";
    }
    else if(bonneRep > 8)
    {
        srcImage = "/champion.png";
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex-col items-center justify-between p-5">
                <Link href="/homepage" passHref>
                    <Button text="HomePage"/>
                </Link> 
                <h1 className="flex items-center justify-center text-4xl font-bold mb-20"><b><u>Votre score :</u></b> {bonneRep}/10</h1>
                <div className="flex items-center justify-center">
                <Image
                        src= {srcImage}
                        width={100}
                        height={50}
                        alt="Result Image"
                        className="block"
                />
                </div>
                <h3 className="flex items-center justify-center text-2xl font-bold">Retour sur vos réponses...</h3>
                {res.map((elem, index) => (
                    <QuestionCard key={index} index={index} resp={elem}/> // Ajout de la clé unique key
                ))}
            </div>
        </motion.div>
    )
}

export default EndPage;
