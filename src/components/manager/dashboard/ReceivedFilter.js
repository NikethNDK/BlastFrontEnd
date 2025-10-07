import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";

const ReceivedFilter = ({ setReceivedCount }) => {
  const seenEntryNos = useRef(new Set());
  const [receive, setReceive] = useState([]);
  const [newEntries, setNewEntries] = useState(new Set());

  const getHeaderStyle = () => ({
    backgroundColor: "#f8fafc",
    fontWeight: 600,
    color: "#1e293b",
    textAlign: "center",
    border: "1px solid #e2e8f0",
    padding: "12px",
    fontSize: "0.875rem",
  });

  const getCellStyle = () => ({
    textAlign: "center",
    border: "1px solid #e2e8f0",
    padding: "12px",
    fontSize: "0.875rem",
    color: "#475569",
  });

  const columns = [
    {
      dataField: "item_code",
      text: "Item Code",
      filter: textFilter(),
      sort: true,
      headerStyle: getHeaderStyle,
      style: getCellStyle,
    },
    {
      dataField: "item_name",
      text: "Item Name",
      filter: textFilter(),
      sort: true,
      headerStyle: getHeaderStyle,
      style: getCellStyle,
    },
    {
      dataField: "project_name",
      text: "Project Name",
      filter: textFilter(),
      sort: true,
      headerStyle: getHeaderStyle,
      style: getCellStyle,
    },
    {
      dataField: "project_code",
      text: "Project Code",
      filter: textFilter(),
      sort: true,
      headerStyle: getHeaderStyle,
      style: getCellStyle,
    },
    {
      dataField: "receipt_date",
      text: "Receipt Date",
      filter: textFilter(),
      sort: true,
      headerStyle: getHeaderStyle,
      style: getCellStyle,
    },
    {
      dataField: "expiry_date",
      text: "Expiry Date",
      filter: textFilter(),
      sort: true,
      headerStyle: getHeaderStyle,
      style: getCellStyle,
    },
    {
      dataField: "quantity_received",
      text: "Quantity Received",
      filter: textFilter(),
      sort: true,
      headerStyle: getHeaderStyle,
      style: getCellStyle,
    },
    {
      dataField: "manufacturer",
      text: "Manufacturer",
      filter: textFilter(),
      sort: true,
      headerStyle: getHeaderStyle,
      style: getCellStyle,
    },
    {
      dataField: "supplier",
      text: "Supplier",
      filter: textFilter(),
      sort: true,
      headerStyle: getHeaderStyle,
      style: getCellStyle,
    },
    {
      dataField: "invoice_no",
      text: "Invoice No/Date",
      filter: textFilter(),
      sort: true,
      headerStyle: getHeaderStyle,
      style: getCellStyle,
    },
    {
      dataField: "po_number",
      filter: textFilter(),
      text: "PO Number",
      sort: true,
      headerStyle: getHeaderStyle,
      style: getCellStyle,
    },
    {
      dataField: "batch_number",
      filter: textFilter(),
      text: "Batch/Lot Number",
      sort: true,
      headerStyle: getHeaderStyle,
      style: getCellStyle,
    },
    {
      dataField: "remarks",
      filter: textFilter(),
      text: "Remarks",
      sort: true,
      headerStyle: getHeaderStyle,
      style: getCellStyle,
    },
    { dataField: "entry_no", text: "Entry No", hidden: true },
  ];

  const rowClasses = (row) => {
    if (newEntries.has(String(row.entry_no))) {
      return "highlight-new-row";
    }
    return "";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/itemreceive/");
        const { new_data, all_data } = response.data;

        setReceive(all_data);

        const freshEntries = new_data.filter(
          (item) => !seenEntryNos.current.has(item.entry_no)
        );

        if (freshEntries.length > 0) {
          setReceivedCount(freshEntries.length);
          freshEntries.forEach((item) =>
            seenEntryNos.current.add(item.entry_no)
          );
        }

        const newEntrySet = new Set([
          ...newEntries,
          ...freshEntries.map((item) => String(item.entry_no)),
        ]);
        setNewEntries(newEntrySet);

        setTimeout(() => {
          const updated = new Set(newEntrySet);
          freshEntries.forEach((item) => updated.delete(String(item.entry_no)));
          setNewEntries(updated);
        }, 100000);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [setReceivedCount, newEntries]);

  return (
    <div style={{ marginTop: "1px", width: "100%" }}>

      <div style={{ paddingTop: "10px" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowY: "scroll", maxHeight: "300px" }}>
            <BootstrapTable
              keyField="entry_no"
              data={receive}
              columns={columns}
              striped
              hover
              bordered={false}
              className="react-bootstrap-table"
              filter={filterFactory()}
              rowClasses={rowClasses}
              rowStyle={{
                borderBottom: "1px solid #e2e8f0",
              }}
              headerClasses="table-header"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(.react-bootstrap-table) {
          border-collapse: separate;
          border-spacing: 0;
        }

        :global(.react-bootstrap-table table) {
          margin-bottom: 0 !important;
        }

        :global(.react-bootstrap-table tbody tr:hover) {
          background-color: #f1f5f9 !important;
        }

        :global(.react-bootstrap-table .filter) {
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 6px 8px;
          font-size: 0.875rem;
          margin-top: 4px;
        }

        :global(.react-bootstrap-table .filter:focus) {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        :global(.table-header) {
          position: sticky;
          top: 0;
          z-index: 10;
        }

        :global(.highlight-new-row) {
          background-color: #fef3c7 !important;
          animation: fadeHighlight 100s ease-out forwards;
        }

        :global(.highlight-new-row:hover) {
          background-color: #fde68a !important;
        }

        @keyframes fadeHighlight {
          0% {
            background-color: #fef3c7;
          }
          100% {
            background-color: #ffffff;
          }
        }
      `}</style>
    </div>
  );
};

export default ReceivedFilter