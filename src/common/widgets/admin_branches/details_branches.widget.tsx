import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { ScrollIndicator } from "@/common/atoms/indicator";
import BranchStatusModal from "@/common/molecules/admin_branch/branch_status_modal";
import { LeftCardBranch } from "@/common/molecules/admin_branch/details_branches/left_card.molecule";
import { MessageBranches } from "@/common/molecules/admin_branch/details_branches/message_branches.molecule";
import { RightCardBranch } from "@/common/molecules/admin_branch/details_branches/right_card.molecule";
import { ScheduleManagementModal } from "@/common/molecules/admin_branch/details_branches/schedule_management_modal.molecule";

import { useStatesIsOpen } from "@/api/mutations/branches/branch_states.mutation";
import { useBranchesID, useImagenBranch } from "@/api/queries/branches/branch.query";
import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";


export default function PrincipalBranchesPage() {

    const BranchId = getEncryptedItem("branchId") as string | null;
    if (!BranchId) {
        return toast.error('No se encontro el id de la sucursal')
    }

    const EXPOSED_URL = import.meta.env.VITE_EXPOSED_URL;
    const { data: branches, error: branchError, isPending: isBranchLoading } = useBranchesID(Number(BranchId));
    const { data: imagen, error: imageError, isPending: isImageLoading } = useImagenBranch(Number(BranchId));    const { mutateAsync: useStateOpen, error: statusError } = useStatesIsOpen();
    const [branchStatus, setBranchStatus] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const {ErrorMessageBranch, NoDataMessageBranch, LoadingMessageBranch} = MessageBranches
   
    useEffect(() => {
        if (branches?.branch.is_open !== undefined) {
            setBranchStatus(branches.branch.is_open);
        }
    }, [branches?.branch.is_open]);



    const handleConfirmStatusChange = () => {
        setBranchStatus(branchStatus === true ? false : true);
        useStateOpen({ id: Number(BranchId), is_open: branchStatus === true ? false : true })

        setTimeout(() => {
            setIsModalOpen(false);
        }, 900);
    };
    const handleStatusClick = () => {
        setIsModalOpen(true);
    };

    const handleManageSchedule = () => {
        setIsScheduleModalOpen(true);
    };

    if (isBranchLoading || isImageLoading) {
        return (
            <LoadingMessageBranch />
        );
    }

    if (branchError || imageError || statusError) {
        return (
            <ErrorMessageBranch 
            branchError={branchError} 
            imageError={imageError} 
            statusError={statusError}/>
        );
    }

    if (!branches?.branch) {
        return (
           <NoDataMessageBranch />
        );
    }

    return (
        <div className="container h-full max-w-full  px-5 py-5 scrollbar-subtle">
            <div ref={scrollContainerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full  overflow-y-auto  scrollbar-subtle">

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                    <ScrollIndicator className="bg-[#6F4E37]/10 hover:bg-[#6F4E37]/20" containerRef={scrollContainerRef as React.RefObject<HTMLElement>}></ScrollIndicator>
                </div>
                {/* Left column */}
                <div className="h-full">
                    <LeftCardBranch branches={branches} imagen={imagen} />
                </div>                {/* Right column */}
                <div className="h-full">
                    <RightCardBranch
                        branches={branches}
                        branchStatus={branchStatus}
                        handleStatusClick={handleStatusClick}
                        EXPOSED_URL={EXPOSED_URL}
                        onManageSchedule={handleManageSchedule} />
                </div>
            </div>            <BranchStatusModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentStatus={branchStatus}
                onConfirm={handleConfirmStatusChange}
            />

            <ScheduleManagementModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                branch={branches?.branch || null}
            />
        </div>
    );
}