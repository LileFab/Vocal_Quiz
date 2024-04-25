import { motion } from "framer-motion"
import Link from "next/link"
import Button from "@/app/components/ui/Button"
import { UsersResponse } from "@/app/interface/UserResponse"
import QuestionCard from "@/app/components/QuestionCard";
import { useEffect, useState, useRef } from "react";
import { getLastResponses } from "@/app/actions/statsActions";

const EndPage = ({userName, bonneRep} : {userName: string, bonneRep: number}) => {

    const [res, setRes] = useState<UsersResponse[]>([]);
    const isFirstRun = useRef(true); // Utilisation d'une référence ref pour suivre la première exécution

    useEffect (() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            const get10LastResp = async () => {
                const newRes = await getLastResponses(10) as UsersResponse[];
                setRes(newRes);
            };
            get10LastResp();
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex-col items-center justify-between p-24">
                <h1 className="text-3xl capitalize font-bold mb-20">{userName} vous avez {bonneRep}/10</h1>
                <Link href="/homepage" passHref>
                    <Button text="Retour home"/>
                </Link> 
                {res.map((elem, index) => (
                    <QuestionCard key={index} index={index} resp={elem}/> // Ajout de la clé unique key
                ))}
            </div>
        </motion.div>
    )
}

export default EndPage;
