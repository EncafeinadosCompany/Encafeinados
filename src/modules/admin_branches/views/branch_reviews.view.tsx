import { useBranchContext } from "@/common/context/branch_context";
import {BranchReviewsWidget} from "@/common/widgets/admin_branches/reviews.widget";

export default function BranchReviewsView() {
  const {selectedBranchId} = useBranchContext()
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="overflow-y-auto  min-h-[80vh] scrollbar-thin ">
        <BranchReviewsWidget  branchId={selectedBranchId!!}/>
      </div>
    </div>
  );
}