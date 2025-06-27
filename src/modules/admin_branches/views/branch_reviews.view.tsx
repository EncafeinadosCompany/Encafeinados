import BranchReviewsWidget from "@/common/widgets/admin_branches/reviews.widget";

export default function BranchReviewsView() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-400 scrollbar-track-amber-100 px-1 py-2">
        <BranchReviewsWidget />
      </div>
    </div>
  );
}