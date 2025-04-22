

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page:number) => void;
}

const Pagination = ({totalItems, itemsPerPage, currentPage, onPageChange}: PaginationProps) => {
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  //handle Prev and Next buttons
  const handlePrev = () =>{
    if(currentPage > 1){
      onPageChange(currentPage - 1);
    }
  }

  const handleNext = () =>{
    if(currentPage < totalPages){
      onPageChange(currentPage + 1);
    }
  }

  const getPageNumbers = () => {
    const maxPagesToShow = 3; // Maximum number of page buttons to show
    const pages: (number | string)[] = [];
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
    // Adjust startPage if endPage is at the maximum to ensure maxPagesToShow buttons
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
  
    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }
  
    // Add page numbers in the range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  
    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
  
    console.log("Generated pages:", pages); // For debugging
    return pages;
  };


  return (
      <div className="p-4 flex items-center justify-between text-gray-500">
        <button
        onClick={handlePrev}
          disabled = {currentPage === 1}
          className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <div className="flex items-center gap-2 text-sm">
          {getPageNumbers().map((page, index)=>typeof page === "number" ? (
            <button key={page} onClick={()=>onPageChange(page)} className={`px-2 rounded-sm ${currentPage === page ? "bg-[#C3EBFA]":"hover:bg-slate-100"}`}>{page}</button>
          ) : (
            <span key={`ellipsis-${index}`} className="px-2">
              {page}
            </span>
          ))}
        </div>
        <button onClick={handleNext} disabled={currentPage === totalPages} className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
          Next
        </button>
      </div>
    );
  };
  
  export default Pagination;