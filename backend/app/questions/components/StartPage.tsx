import { motion } from "framer-motion"
import Link from "next/link"
import Button from "@/app/components/ui/Button"

export const StartPage = () => {
  return (
    <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex-col items-center justify-between p-24">
                <h1 className="text-xl font-bold mb-20">Vous êtes sur le point de démarrer un quiz à réponse vocale</h1>
                <p className="mt-10">Merci de vous assurer d'être dans un environnement calme afin que l'application capte votre voix façon clair</p>
                <p>Seulemnt votre première réponse sera interpréter par le système, si vous donnez plusieurs réponses nous ne pouvons garantir le résultat</p>
               
            </div>
        </motion.div>
  )
}