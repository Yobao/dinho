import React, { useState, useEffect, useContext } from "react";
import LoadingButton from "../../../components/low-lvl-components/button-loading";
import TableComponent from "../../../components/table/table";
import { url } from "../../../local";
import { USER_TABLE_BODY } from "../../../objects/objects";
import { OtherUserContext, LanguageContext } from "../../../store/user-context";

function OtherUserPageComponent() {
  const otherUserContext = useContext(OtherUserContext);
  const languageContext = useContext(LanguageContext);
  const appLanguage = languageContext.appLanguage;
  const [isLoading, setIsLoading] = useState(true);
  const [errorGet, setErrorGet] = useState(null);
  const [tableData, setTableData] = useState(null);

  const tableStructure = {
    head: appLanguage.userTableHead,
    body: USER_TABLE_BODY,
  };

  useEffect(() => {
    requestData();
  }, []);

  const requestData = async () => {
    const requestOptions = {
      method: "GET",
    };
    try {
      const res = await fetch(`${url}/tips?u=${otherUserContext[0].otherUserId}`, requestOptions);
      const resData = await res.json();

      if (res.status === 200) {
        setTableData(resData);
        setIsLoading(false);
      }
    } catch (error) {
      setErrorGet(error);
    }
  };

  const goBackToTable = () => {
    otherUserContext[1]({ otherUserName: null, otherUserId: null });
  };

  return (
    <React.Fragment>
      {isLoading && !tableData && <LoadingButton />}
      {!isLoading && tableData && (
        <div className='body-page column is-6'>
          <div className='has-text-left'>
            <button className='button is-primary' onClick={goBackToTable}>
              {appLanguage.userTableButton}
            </button>
          </div>
          <div>
            <h2 className='has-text-centered title is-3 mb-5'>{otherUserContext[0].otherUserName}</h2>
          </div>
          <TableComponent data={tableData} tableStructure={tableStructure} />
        </div>
      )}
    </React.Fragment>
  );
}

export default OtherUserPageComponent;
