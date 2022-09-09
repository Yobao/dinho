import React, { useState, useEffect, useRef } from "react";
import { useContext } from "react";
import { url } from "../../../local";
import { USER_TABLE_BODY } from "../../../objects/objects";
import { UserContext, OtherUserContext, DropdownTitleContext, LanguageContext } from "../../../store/user-context";
import LoadingButton from "../../../components/low-lvl-components/button-loading";
import TableComponent from "../../../components/table/table";

function CurrentUserPageComponent() {
  const userContext = useContext(UserContext);
  const otherUserContext = useContext(OtherUserContext);
  const dropdownTitleContext = useContext(DropdownTitleContext);
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

  useEffect(() => {
    otherUserContext[1]({ otherUserName: null, otherUserId: null });
    dropdownTitleContext[1](null);
  }, []);

  const requestData = async () => {
    const requestOptions = {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("dinhotoken")}` },
    };
    try {
      const res = await fetch(`${url}/tips?u=-9`, requestOptions);
      const resData = await res.json();

      if (res.status === 200) {
        setTableData(resData);
        setIsLoading(false);
      }
    } catch (error) {
      setErrorGet(error);
    }
  };

  return (
    <React.Fragment>
      {isLoading && !tableData && <LoadingButton />}
      {!isLoading && tableData && (
        <div className='body-page column is-6'>
          <div className=''>
            <h2 className='has-text-centered title is-3 mb-5'>{userContext[0]}</h2>
          </div>
          <TableComponent data={tableData} tableStructure={tableStructure} />
        </div>
      )}
    </React.Fragment>
  );
}

export default CurrentUserPageComponent;
