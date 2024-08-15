import React, { useState } from "react";
import DataTable from "react-data-table-component";

function Table({ columns, data, title ,rowsPerPage,addButton}) {
  const [searchText, setSearchText] = useState("");

  const filteredData = data.filter((item) => {
    return columns.some((column) => {
      if (typeof column.selector === "function") {
        const value = column.selector(item);
        return value && value.toString().toLowerCase().includes(searchText.toLowerCase());
      }
      return false;
    });
  });

  return (
    <div style={{ margin: "0 auto", width: "90%" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>{title}</h2>
      <div className="row">
        <div className="col-12 d-flex flex-column flex-md-row justify-content-between">
        <div className="col-12 col-md-6 col-lg-6">
        {addButton}
          </div>
          <div className="col-12 col-md-6 col-lg-6">
            <input
              type="text"
              placeholder="Search"
              value={searchText}
              className="form-control"
              onChange={(e) => setSearchText(e.target.value)}
              style={{ margin: "10px 0", padding: "5px" }}
            />
          </div>
        </div>
        <div className="table-responsive">
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            paginationPerPage={rowsPerPage}
            sortable
          />
        </div>
      </div>
    </div>
  );
}

export default Table;
