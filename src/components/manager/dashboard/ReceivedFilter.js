import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "../../../App.css";

const ReceivedFilter = ({ setReceivedCount }) => {
  const seenEntryNos = useRef(new Set());
  const [receive, setReceive] = useState([]);
  const [newEntries, setNewEntries] = useState(new Set());

  const getHeaderStyle = () => ({
    backgroundColor: "#C5EA31",
    width: "50px",
    color: "black",
    textAlign: "center",
    border: "1px solid black",
  });

  const getCellStyle = () => ({
    textAlign: "center",
    border: "1px solid black",
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

        // const newEntrySet = new Set(
        //   freshEntries.map((item) => String(item.entry_no))
        // );
        // setNewEntries(newEntrySet);
        const newEntrySet = new Set([
          ...newEntries,
          ...freshEntries.map((item) => String(item.entry_no)),
        ]);
        setNewEntries(newEntrySet);

        setTimeout(() => {
          // Remove only those specific entries after 50 seconds
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
  }, [setReceivedCount]);

  return (
    <div>
      <div style={{ overflowY: "scroll", maxHeight: "300px" }}>
        <BootstrapTable
          keyField="entry_no"
          data={receive}
          columns={columns}
          filter={filterFactory()}
          rowClasses={rowClasses} // ✅ THIS is what applies the CSS class
        />
      </div>
    </div>
  );
};

export default ReceivedFilter;
