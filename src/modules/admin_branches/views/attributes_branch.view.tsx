import { useBranchContext } from "@/common/context/branch_context";
import AttributesWidget from "@/common/widgets/admin_branches/attributes.widget";

export default function AttrbuteBranchView () {

    const {selectedBranchId} = useBranchContext()
    return (
        <AttributesWidget branchId={selectedBranchId || ""}></AttributesWidget>
    )

}