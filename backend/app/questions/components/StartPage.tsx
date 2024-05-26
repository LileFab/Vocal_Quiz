import { motion } from "framer-motion"

export const StartPage = () => {
  return (
    <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <div className="flex-col items-center justify-between p-24">
                <h1 className="text-2xl font-bold mb-20">Vous êtes sur le point de démarrer un quiz à réponse vocale !</h1>
                <p className="mt-10">Merci de vous assurer d'être dans un environnement relativement calme afin que l'application capte votre voix de façon clair.</p>
                <p className="mt-10">Le quiz est composé de 10 questions pouvant être de 2 formes différentes :</p>
                <ul className="mt-10">
                    <li>-&gt; Des quesions avec 4 propositions de réponses, vous serez inviter à répondre par 1, 2, 3 ou 4.</li>
                    <li>-&gt; Ou des questions oui / non où vous serez inviter à répondre soit par oui soit par non.</li>
                </ul>
                <p className="mt-10">Afin d'être sûr que vos réponses seront bien enregistrées merci de réaliser le quiz dans son entiéreté.</p>
            </div>
        </motion.div>
  )
}