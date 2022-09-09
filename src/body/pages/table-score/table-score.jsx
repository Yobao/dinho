import React, { useState, useEffect, useContext } from "react";
import { url } from "../../../local";
import TableComponent from "../../../components/table/table";
import DropdownComponent from "../../../components/low-lvl-components/dropdown";
import LoadingButton from "../../../components/low-lvl-components/button-loading";
import PaginationComponent from "../../../components/pagination/pagination";
import { SCORE_TABLE_BODY } from "../../../objects/objects";
import { PRICES } from "../../../objects/objects";

import { OtherUserContext, LanguageContext } from "../../../store/user-context";

function ScoreTablePageComponent() {
  const otherUserContext = useContext(OtherUserContext);
  const languageContext = useContext(LanguageContext);
  const appLanguage = languageContext.appLanguage;
  const [errorGet, setErrorGet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRound, setIsLoadingRound] = useState(false);
  const [tableData, setTableData] = useState(null);
  const [dropDownData, setDropDownData] = useState(null);
  const [match, setMatch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(50);

  const tableStructure = {
    head: appLanguage.scoreTableHead,
    body: SCORE_TABLE_BODY,
    prices: PRICES,
  };

  useEffect(() => {
    if (isLoading || isLoadingRound) requestData();
  }, [match]);

  const requestData = async () => {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: { "Access-Control-Allow-Origin": "*" },
    };
    try {
      const res = await fetch(`${url}/table${match === null ? "" : "?" + match}`, requestOptions);
      const resData = await res.json();

      if (res.status === 200) {
        setTableData(resData.table);
        setDropDownData(resData.matches);
        setIsLoading(false);
        setIsLoadingRound(false);
      }
    } catch (error) {
      setErrorGet(error);
    }
  };

  const handleLoadingRound = () => {
    setIsLoadingRound(!isLoadingRound);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  return (
    <React.Fragment>
      {isLoading && <LoadingButton />}
      {!isLoading && tableData && !otherUserContext[0].otherUserName && !otherUserContext[0].otherUserId && (
        <div className='column is-6 my-4'>
          <div className='columns is-centered mb-6 mt-4 mx-3 is-6'>
            <DropdownComponent
              data={dropDownData}
              matchChange={{
                match: match,
                setMatch: setMatch,
                resetPage: setCurrentPage,
                isLoadingRound: handleLoadingRound,
              }}
            />
          </div>
          {isLoadingRound && <LoadingButton />}
          {!isLoadingRound && (
            <React.Fragment>
              <TableComponent
                data={tableData.slice(indexOfFirstUser, indexOfLastUser)}
                tableStructure={tableStructure}
                positionMultiplier={currentPage * usersPerPage - usersPerPage}
              />
              <PaginationComponent
                currentPage={{ changeCurrentPage: setCurrentPage, currentPage: currentPage }}
                length={Math.ceil(tableData.length / usersPerPage)}
              />
            </React.Fragment>
          )}
        </div>
      )}
    </React.Fragment>
  );
}

export default ScoreTablePageComponent;
