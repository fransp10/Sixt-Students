function Pagination({
  currentPageNumber,
  totalPages,
  setPageNumber,
}: {
  currentPageNumber: number;
  totalPages: number;
  setPageNumber: (page: number) => void;
}) {
  const WINDOW = 3;

  const start = Math.max(
    1,
    Math.min(currentPageNumber - 1, totalPages - WINDOW + 1),
  );
  const end = Math.min(totalPages, start + WINDOW - 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex flex-row gap-4">
      {pages.map((page) => (
        <button
          key={page}
          disabled={page === currentPageNumber}
          onClick={() => setPageNumber(page)}
          className={`size-10 rounded-lg hover:cursor-pointer disabled:cursor-not-allowed  ${
            page === currentPageNumber ? "bg-primary/80" : ""
          }`}
          aria-current={page === currentPageNumber ? "page" : undefined}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
export default Pagination;
