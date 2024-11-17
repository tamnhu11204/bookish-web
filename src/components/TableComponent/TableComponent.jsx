import React from 'react';
import './TableComponent.css';

const TableComparison = ({ data, pro1, pro2, pro3 }) => {
  return (
    <div className="container mt-5">
      <table className="table table-bordered table-striped custom-table">
        <thead className="custom-header">
          <tr>
            <th className="col-4">Tiêu chí</th>
            <th className="col-4">{pro1}</th>
            <th className="col-4">{pro2}</th>
            <th className="col-4">{pro3}</th>
          </tr>
        </thead>
        <tbody className="custom-body">
          {data.map((row, index) => (
            <tr key={index}>
              <td className="col-4">{row.criteria}</td>
              <td className="col-4">
                <span className={row.product1}>
                  {row.product1}
                </span>
              </td>
              <td className="col-4">
                <span className={row.product2}>
                  {row.product2}
                </span>
              </td>
              <td className="col-4">
                <span className={row.product3}>
                  {row.product3}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComparison;
