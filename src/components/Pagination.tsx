const Pagination = ({
  page,
  setPage,
  perPage,
  setPerPage,
  totalPages,
  totalResults,
  options,
}: {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  perPage: number;
  setPerPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalResults: number;
  options?: number[];
}) => {
  if (!options || (options && options.length === 0)) {
    options = [5, 10, 20];
  }
  // Handle per page change
  function handlePerPageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setPage(1);
    setPerPage(Number(e.target.value));
  }

  return (
    <div className="flex justify-between my-4">
      <div className="flex items-center gap-2">
        <select
          title="perPage"
          onChange={handlePerPageChange}
          value={perPage}
          className="text-center py-1 text-sm gradientselect w-20 bg-base-200 rounded">
          {options.map((option) => (
            <option key={option} className="bg-base-200 text-sm" value={option}>
              {`1-${option}`}
            </option>
          ))}
        </select>
        <p className="text-sm">of</p>
        <p className="text-sm">{totalResults}</p>
      </div>

      <div className="join">
        {page > 1 && (
          <button onClick={() => setPage(page - 1)} className="join-item btn btn-sm">
            «
          </button>
        )}
        {page > 1 && (
          <button onClick={() => setPage(1)} className="join-item btn btn-sm">
            1
          </button>
        )}
        {page - 1 > 2 && <button className="join-item btn btn-sm btn-disabled">...</button>}
        {page > 2 && (
          <button onClick={() => setPage(page - 1)} className="join-item btn  btn-sm">
            {page - 1}
          </button>
        )}
        {totalPages > 1 && <button className="join-item btn btn-primary rounded btn-sm hover:cursor-default">{page}</button>}
        {page + 1 < totalPages && (
          <button onClick={() => setPage(page + 1)} className="join-item btn  btn-sm ">
            {page + 1}
          </button>
        )}
        {totalPages - page > 2 && <button className="join-item btn btn-sm btn-disabled">...</button>}
        {page < totalPages && (
          <button onClick={() => setPage(totalPages)} className="join-item btn btn-sm">
            {totalPages}
          </button>
        )}
        {page < totalPages && (
          <button onClick={() => setPage(page + 1)} className="join-item btn btn-sm rounded">
            »
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
