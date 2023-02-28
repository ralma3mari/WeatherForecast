import React, { useState, useEffect } from "react";
import "../Styles/Pagination.css";

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const [isDisabled, setIsDisabled] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const pages = Math.ceil(totalItems / itemsPerPage);
        setTotalPages(pages);
    }, [totalItems, itemsPerPage]);

    const handlePageChange = (newPage) => {
        if (!isDisabled) {
            setIsDisabled(true);
            onPageChange(newPage);
            setTimeout(() => {
                setIsDisabled(false);
            }, 3000);
        }
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        const halfVisiblePages = Math.floor(maxVisiblePages / 2);

        let startPage, endPage;
        if (totalPages <= maxVisiblePages) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= halfVisiblePages) {
                startPage = 1;
                endPage = maxVisiblePages;
            } else if (currentPage + halfVisiblePages >= totalPages) {
                startPage = totalPages - maxVisiblePages + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - halfVisiblePages;
                endPage = currentPage + halfVisiblePages;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="pagination">
            <button
                className="pagination__button"
                disabled={currentPage === 1 || isDisabled}
                onClick={() => handlePageChange(1)}
            >
                First
            </button>
            <button
                className="pagination__button"
                disabled={currentPage === 1 || isDisabled}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                Previous
            </button>
            {pageNumbers.map((pageNumber) => (
                <button
                    key={pageNumber}
                    className={`pagination__button ${pageNumber === currentPage ? "pagination__button--active" : ""}`}
                    disabled={isDisabled}
                    onClick={() => handlePageChange(pageNumber)}
                >
                    {pageNumber}
                </button>
            ))}
            <button
                className="pagination__button"
                disabled={currentPage === totalPages || isDisabled}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                Next
            </button>
            <button
                className="pagination__button"
                disabled={currentPage === totalPages || isDisabled}
                onClick={() => handlePageChange(totalPages)}
            >
                Last
            </button>
            <div className="pagination__info">
                <span>Page {currentPage} of {totalPages}</span>
            </div>
        </div>
    );
};

export default Pagination;