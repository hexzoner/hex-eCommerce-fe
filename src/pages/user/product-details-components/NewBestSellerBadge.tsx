import newBadge from "../../../assets/new-badge.png"

export default function NewBestSellerBadge({ isNew, isBestSeller }: { isNew: boolean; isBestSeller: boolean }) {
  return (
    <div className="pointer-events-none">
      {isNew && (
        // <span className="badge badge-info badge-sm py-6 px-4 border-black border-opacity-25 font-semibold ">NEW</span>
        <span className="absolute top-3 right-3 z-20"><img src={newBadge} alt="" /></span>
      )}
      {isBestSeller && (
        <span className="badge rounded-sm  bg-[#E9B44C] text-black border-opacity-0 py-3 px-4  absolute top-4 right-4 text-center text-sm z-20">
          Bestseller
        </span>
      )}
    </div>
  );
}
