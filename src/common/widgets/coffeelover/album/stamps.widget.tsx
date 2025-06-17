import { useEffect, useState } from "react";
import { useStampsByClientQuery, useStampsByPageQuery } from "@/api/queries/album/stamps.query";
import { getAuthStorage } from "@/common/utils/security/auth_storage.utils";
import { Stamps } from "@/api/types/album/stamps.types";
import { CardStamp } from "@/common/molecules/coffeelover/stamps/card_stamp.molecule";
import { CardEmpy } from "@/common/molecules/coffeelover/stamps/card_empy.molecule";
import { CardStampsError } from "@/common/molecules/coffeelover/stamps/card_error.molecule";
import { CardStampSkeleton } from "@/common/molecules/coffeelover/stamps/card_skeleton.molecule";
import { CardStampsDetails } from "@/common/molecules/coffeelover/stamps/dialog_details.molecule";
import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";
import { UserData } from "@/api/types/auth/auth.types";


interface PruebaProps {
    id_page: number;

}
export default function ListStamps({ id_page }: PruebaProps) {

    const id = getEncryptedItem("userId") ;
    const { data: users } = useStampsByClientQuery(id as number);
    const { data: stampData, error, isLoading } = useStampsByPageQuery(id_page);
    const [stamps, setStamps] = useState<Stamps[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [hoverStamp, setHoverStamp] = useState<number | null>(null);
    const [selectedStamp, setSelectedStamp] = useState<Stamps | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
   
    const handleFlip = (id: number) => {
        if (flippedCards.includes(id)) {
            setFlippedCards(flippedCards.filter(cardId => cardId !== id));
        } else {
            setFlippedCards([...flippedCards, id]);
        }

    }

    useEffect(() => {
        // Clear stamps and flipped cards when page changes
        setStamps([]);
        setFlippedCards([]);
        setHoverStamp(null);
        if (stampData?.stamps) {
            setStamps(stampData.stamps);
        }
    }, [id, stampData]);


    const skeletonArray = Array(4).fill(0);


    // navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       const latitude = position.coords.latitude;
    //       const longitude = position.coords.longitude;

    //       // Aquí haces la llamada al backend
    //     //   enviarUbicacionAlBackend(latitude, longitude);
    //     console.log("Latitud:", latitude);
    //     console.log("Longitud:", longitude);
    //     },
    //     (error) => {
    //       console.error("Error obteniendo la ubicación:", error);
    //     },
    //     {
    //       enableHighAccuracy: true,
    //       timeout: 5000,
    //       maximumAge: 0
    //     }
    //   );

    return (
        <div className="flex flex-col justify-center items-center p-4 sm:p-6 md:p-2 w-full min-h-0 pb-20" onPointerDown={(e) => e.stopPropagation()}>
            <div className="w-full">
                {/* Loading State */}
                {isLoading && (
                    <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {skeletonArray.map((_, index) => (
                            <CardStampSkeleton key={index} />
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <CardStampsError />
                )}

                {/* No Stamps State */}
                {!isLoading && !error && stamps.length === 0 && (
                    <CardEmpy />
                )}

                {/* Stamps Display */}
                {!isLoading && !error && stamps.length > 0 && (
                    <CardStamp
                        stamps={stamps}
                        users={users || null}
                        flippedCards={flippedCards}
                        hoverStamp={hoverStamp}
                        setModalOpen={setModalOpen}
                        setSelectedStamp={setSelectedStamp}
                        handleFlip={handleFlip}
                    />
                )}
                <CardStampsDetails
                    users={users || null}
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    selectedStamp={selectedStamp}
                />
            </div>
        </div>
    )
}