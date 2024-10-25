export default function NewBestSellerBadge({ isNew, isBestSeller }: { isNew: boolean; isBestSeller: boolean }) {
  return (
    <div className="pointer-events-none">
      {isNew && <span className="badge badge-info badge-sm py-6 px-4 border-black border-opacity-25 font-semibold absolute top-0 right-0 ">NEW</span>}
      {isBestSeller && (
        <span className="badge badge-neutral border-white border-opacity-75 py-7 px-5 font-semibold absolute top-0 right-0 text-center text-sm">
          BEST
          <br /> SELLER
        </span>
      )}
    </div>
  );
}
