import React, { useState, useEffect, useContext, Fragment } from "react";
import { UserContext, OtherUserContext } from "../../store/user-context";

function TableComponent(props) {
  const userContext = useContext(UserContext);
  const otherUserContext = useContext(OtherUserContext);
  const tableHead = props.tableStructure.head;
  const tableBody = props.tableStructure.body;
  const tablePrices = props.tableStructure.prices;
  const positionMultiplier = props.positionMultiplier;

  const pointsHighlight = (column, points) => {
    return column + 1 === tableHead.length && points > 0 ? "has-text-success has-text-weight-bold" : "";
  };

  const currentUserHighlight = (user) => {
    return userContext[0] === user ? "has-background-danger-light" : null;
  };

  const firstColumnValues = (rowIndex) => {
    let price = tablePrices[rowIndex] !== undefined && !positionMultiplier ? ` ${tablePrices[rowIndex]}` : "";
    return rowIndex + positionMultiplier + 1 + price;
  };

  const callOtherUserTable = (e) => {
    otherUserContext[1]({ otherUserName: e.target.innerText, otherUserId: e.target.getAttribute("value") });
  };

  return (
    <React.Fragment>
      <table cellSpacing='0' className='table is-bordered is-striped is-hoverable is-narrow is-fullwidth is-mobile'>
        <thead>
          <tr>
            {tableHead.map((column, i) => {
              return (
                <th key={column} className='has-text-centered is-vcentered'>
                  {column}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {props.data.map((row, rowIndex) => {
            return (
              <tr key={`score-table-row-${rowIndex}`}>
                {tableBody.map((column, colIndex) => {
                  return (
                    <td
                      key={`score-table-${rowIndex}-${column.name}-${row[column.name]}`}
                      className={`${column.class} ${currentUserHighlight(row.username)} ${pointsHighlight(
                        colIndex,
                        row[column.name]
                      )} is-vcentered`}
                      value={column.name === "username" ? row.id : ""}
                      onClick={column.name === "username" ? callOtherUserTable : null}
                    >
                      {column.name === "position" ? firstColumnValues(rowIndex) : row[column.name]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </React.Fragment>
  );
}

export default TableComponent;
