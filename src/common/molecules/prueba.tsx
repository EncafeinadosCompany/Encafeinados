import { useState } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { motion } from "framer-motion";

const sellosCliente = [
    {
        id: 1,
    },
    {
        id: 2,
    },
]

const sellosStore = [
    {
        id: 1,
        image: "https://images.pexels.com/photos/2638019/pexels-photo-2638019.jpeg?cs=srgb&dl=pexels-anna-tukhfatullina-food-photographerstylist-2638019.jpg&fm=jpg",
        nombre: "sello 1",
        descripcion: "Un delicioso café con notas de chocolate y caramelo."
    },
    {
        id: 2,
        image: "https://images.pexels.com/photos/2638019/pexels-photo-2638019.jpeg?cs=srgb&dl=pexels-anna-tukhfatullina-food-photographerstylist-2638019.jpg&fm=jpg",
        nombre: "sello 2",
        descripcion: "Blend suave con aroma intenso y sabor equilibrado."
    },
    {
        id: 3,
        image: "https://images.pexels.com/photos/2638019/pexels-photo-2638019.jpeg?cs=srgb&dl=pexels-anna-tukhfatullina-food-photographerstylist-2638019.jpg&fm=jpg",
        nombre: "sello 2",
        descripcion: "Blend suave con aroma intenso y sabor equilibrado."
    }
]

interface Sello {
    sellosCliente: typeof sellosCliente;
    sellosStore: typeof sellosStore;
}

export default function () {
    const [flippedCards, setFlippedCards] = useState<number[]>([]);

    const handleFlip = (id: number) => {
        if (flippedCards.includes(id)) {
            setFlippedCards(flippedCards.filter(cardId => cardId !== id));
        } else {
            setFlippedCards([...flippedCards, id]);
        }
    }

    return (
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col justify-center items-center h-full p-4">
            <h2 className="text-2xl font-bold text-amber-800 mb-6">Colección de Sellos</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 w-full max-w-3xl">
                {
                    sellosStore.map((sello) => {
                        const aplica = sellosCliente.find((selloCliente) => {
                            return selloCliente.id === sello.id;
                        });
                        
                        const isFlipped = flippedCards.includes(sello.id);

                        return (
                            <div key={sello.id} className="h-64 perspective">
                                <motion.div 
                                    className="relative w-full h-full preserve-3d cursor-pointer"
                                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                    onClick={() => handleFlip(sello.id)}
                                >
                                    {/* Front of card */}
                                    <div className="absolute w-full h-full backface-hidden">
                                        <div className={`${!aplica ? "bg-gray-800/50" : ""} absolute z-10 inset-0 p-2 rounded-md`}>
                                            <Badge className="bg-amber-500">
                                                {aplica ? "Aplica" : "No aplica"}
                                            </Badge>
                                        </div>
                                        <Card className="bg-white h-full border-none shadow-2xl">
                                            <CardContent className="p-0 h-full flex flex-col">
                                                <div className="flex-1 overflow-hidden">
                                                    <img 
                                                        className="w-full h-40 object-cover" 
                                                        src={sello.image} 
                                                        alt={sello.nombre} 
                                                    />
                                                </div>
                                                <div className="p-4 bg-amber-600">
                                                    <h3 className="text-lg font-bold text-white">{sello.nombre}</h3>
                                                    <p className="text-xs text-amber-100 mt-1">Presiona para ver detalles</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Back of card */}
                                    <div className="absolute w-full h-full backface-hidden rotateY-180">
                                        <Card className="bg-gradient-to-br from-amber-700 to-amber-900 h-full border-none shadow-2xl">
                                            <CardContent className="p-4 h-full flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold text-amber-100 mb-3">{sello.nombre}</h3>
                                                    <p className="text-amber-200 text-sm">
                                                        {sello.descripcion || "Descripción no disponible"}
                                                    </p>
                                                </div>
                                                <div className="mt-4">
                                                    <Badge className={`${aplica ? "bg-green-500" : "bg-amber-500"}`}>
                                                        {aplica ? "Coleccionado" : "Por coleccionar"}
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </motion.div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}