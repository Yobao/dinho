import React, { useState, useContext } from "react";
import { LanguageContext } from "../../store/user-context";

function PaginationComponent(props) {
  const languageContext = useContext(LanguageContext);
  const [currentPage, setCurrentPage] = useState(props.currentPage.currentPage);
  //const [showPrevious, setShowPrevious] = useState(true);

  const length = props.length;

  //const pages = Array.apply(null, { length: length }).map(Number.call, Number);
  const pages = Array.apply(null, { length: length }).map(Number.call, Number);

  const changeCurrentPage = (e) => {
    props.currentPage.changeCurrentPage(parseInt(e.target.getAttribute("value")));
    setCurrentPage(parseInt(e.target.getAttribute("value")));
    window.scrollTo(0, 0);
  };

  /*  const nextPage = () => {
    props.currentPage.changeCurrentPage(currentPage + 1);
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    props.currentPage.changeCurrentPage(currentPage - 1);
    setCurrentPage(currentPage - 1);
  }; */

  const PageButton = (page) => {
    return (
      <li>
        <a
          value={page + 1}
          className={`pagination-link ${page === currentPage - 1 ? "is-current" : ""}`}
          aria-label={`Goto page ${page + 1}`}
          onClick={changeCurrentPage}
        >
          {page + 1}
        </a>
      </li>
    );
  };

  const DotsButton = () => {
    return (
      <li>
        <span className='pagination-ellipsis'>&hellip;</span>
      </li>
    );
  };

  return (
    <React.Fragment>
      {currentPage && (
        <nav className='pagination is-centered' role='navigation' aria-label='pagination'>
          {/*           {showPrevious && (
            <a className='pagination-previous' onClick={currentPage > 1 ? prevPage : null}>
              {languageContext.pagination.previous}
            </a>
          )}
          <a className='pagination-next' onClick={currentPage < length ? nextPage : null}>
            {languageContext.pagination.next}
          </a> */}
          <ul className='pagination-list'>
            {length > 0 && PageButton(0)}
            {length > 5 && currentPage > 3 && DotsButton()}

            {(((length > 2 && length < 6) || (length > 5 && currentPage < 4)) && PageButton(1)) ||
              (length > 5 && currentPage > 3 && currentPage <= length - 1 && PageButton(currentPage - 2))}

            {(((length > 3 && length < 6) || (length > 5 && currentPage < 4)) && PageButton(2)) ||
              (length > 5 && currentPage > 2 && currentPage < length - 1 && PageButton(currentPage - 1))}

            {((length === 5 || (length > 5 && currentPage == 3)) && PageButton(3)) ||
              (length > 5 && currentPage >= length - 2 && PageButton(length - 2)) ||
              (length > 5 && currentPage >= 3 && currentPage < length - 2 && PageButton(currentPage))}

            {length > 5 && currentPage < length - 2 && DotsButton()}
            {length > 1 && PageButton(length - 1)}
          </ul>
        </nav>
      )}
    </React.Fragment>
  );
}

export default PaginationComponent;
