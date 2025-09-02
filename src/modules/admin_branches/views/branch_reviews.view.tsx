import BranchReviewsWidget from "@/common/widgets/admin_branches/reviews.widget";

export default function BranchReviewsView() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="overflow-y-auto  min-h-[80vh] scrollbar-thin ">
        <BranchReviewsWidget />
      </div>
    </div>
  );
}