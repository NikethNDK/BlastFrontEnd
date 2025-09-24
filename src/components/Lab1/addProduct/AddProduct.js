// import { useState, useEffect } from "react";
// import {
//   createUnit,
//   createLocationCode,
//   createManufacturer,
//   createSupplier,
//   createMasterType,
//   addLabMasterApi,
//   getMastertyApi,
// } from "../../../services/AppinfoService";
// import { Button } from "react-bootstrap";
// import LabNavigation1 from "../homeLab/LabNavigation1";
// const AddProduct = ({
//   userDetails = { name: "", lab: "", designation: "" },
// }) => {
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [inputValue, setInputValue] = useState("");
//   const [masterTypes, setMasterTypes] = useState([]); // State for API data
//   const [masterType, setMasterType] = useState("");
//   const [itemCode, setItemCode] = useState("");
//   const [itemName, setItemName] = useState("");
//   const [units, setUnits] = useState("");
//   const [reqStock, setReqStock] = useState("");

//   const [data, setData] = useState({
//     location: [],
//     manufacturer: [],
//     supplier: [],
//     // unit: [],
//     name: [],
//   });

//   const handleSubmit = async () => {
//     if (!selectedCategory || !inputValue) {
//       alert("Please select a category and enter a value.");
//       return;
//     }

//     try {
//       if (selectedCategory === "Location") {
//         await createLocationCode(inputValue, userDetails.name);
//       } else if (selectedCategory === "Manufacturer") {
//         await createManufacturer(inputValue, userDetails.name);
//       } else if (selectedCategory === "Supplier") {
//         await createSupplier(inputValue, userDetails.name);
//       }
//       // else if (selectedCategory === "Unit") {
//       //   await createUnit(inputValue);
//       // }
//       else if (selectedCategory === "Master") {
//         await createMasterType(inputValue);
//       }
//       setData((prev) => ({
//         ...prev,
//         [selectedCategory.toLowerCase()]: [
//           ...(prev[selectedCategory.toLowerCase()] || []), // Ensure it is an array
//           inputValue,
//         ],
//       }));

//       alert(`${selectedCategory} added successfully!`);
//       setInputValue("");
//     } catch (error) {
//       alert(`Failed to add ${selectedCategory}.`);
//     }
//   };
//   useEffect(() => {
//     const fetchMasterTypes = async () => {
//       try {
//         const data = await getMastertyApi();
//         setMasterTypes(data); // Set API response to state
//       } catch (error) {
//         console.error("Error fetching Master Types:", error);
//       }
//     };
//     fetchMasterTypes();
//   }, []);
//   const handleMasterSubmit = async () => {
//     if (!masterType || !itemCode || !itemName || !units || !reqStock) {
//       alert("Please fill out all fields.");
//       return;
//     }

//     const masterData = {
//       master_type: masterType,
//       item_code: itemCode,
//       item_name: itemName,
//       min_req_stock: reqStock,
//       units: units,
//     };

//     try {
//       await addLabMasterApi(masterData, userDetails);
//       alert("Data added successfully");
//       setMasterType("");
//       setItemCode("");
//       setItemName("");
//       setUnits("");
//       setReqStock("");
//     } catch (error) {
//       alert("Failed to add data.");
//     }
//   };

//   return (
//     <div>
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{
//           minHeight: "85vh",
//           backgroundColor: "#f8f9fa",
//           paddingTop: "20px",
//         }}
//       >
//         <div
//           className="p-5 border rounded shadow-lg bg-white d-flex"
//           style={{ width: "70%", maxHeight: "90vh", overflowY: "auto" }}
//         >
//           {/* Left Section */}
//           <div style={{ width: "30%", paddingRight: "20px" }}>
//             <label className="form-label">Select Category</label>
//             <select
//               value={selectedCategory}
//               className="form-control"
//               onChange={(e) => setSelectedCategory(e.target.value)}
//             >
//               <option value="">-- Select --</option>
//               <option value="Master">Master Type</option>
//               <option value="Location">Location</option>
//               <option value="Manufacturer">Manufacturer</option>
//               <option value="Supplier">Supplier</option>
//             </select>

//             {/* Show input only if a category is selected */}
//             {selectedCategory && (
//               <div className="mt-3">
//                 <label className="form-label">{selectedCategory} Name</label>
//                 <input
//                   type="text"
//                   value={inputValue}
//                   className="form-control"
//                   onChange={(e) => setInputValue(e.target.value)}
//                 />
//                 <Button onClick={handleSubmit} className="w-100 mt-2">
//                   Add {selectedCategory}
//                 </Button>
//               </div>
//             )}
//           </div>

//           {/* Right Section */}
//           <div style={{ width: "70%" }}>
//             {/* First Row */}
//             <div className="d-flex justify-content-between mb-3">
//               {/* Master Type */}
//               <div style={{ width: "45%" }}>
//                 <label className="form-label">Master Type</label>
//                 <select
//                   value={masterType}
//                   className="form-control"
//                   onChange={(e) => setMasterType(e.target.value)}
//                 >
//                   <option value="">Select Master Type</option>
//                   {masterTypes.map((type) => (
//                     <option key={type.id} value={type.name}>
//                       {type.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Unit */}
//               <div style={{ width: "45%" }}>
//                 <label className="form-label">Unit</label>
//                 <input
//                   type="text"
//                   value={units}
//                   className="form-control"
//                   onChange={(e) => setUnits(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Second Row */}
//             <div className="d-flex justify-content-between mb-3">
//               {/* Item Name */}
//               <div style={{ width: "45%" }}>
//                 <label className="form-label">Item Name</label>
//                 <input
//                   type="text"
//                   value={itemName}
//                   className="form-control"
//                   onChange={(e) => setItemName(e.target.value)}
//                 />
//               </div>

//               {/* Item Code */}
//               <div style={{ width: "45%" }}>
//                 <label className="form-label">Item Code</label>
//                 <input
//                   type="text"
//                   value={itemCode}
//                   className="form-control"
//                   onChange={(e) => setItemCode(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Third Row */}
//             <div className="d-flex justify-content-between mt-3">
//               {/* Minimum Required Stock */}
//               <div style={{ width: "45%" }}>
//                 <label className="form-label">Minimum Required Stock</label>
//                 <input
//                   type="text"
//                   value={reqStock}
//                   className="form-control"
//                   onChange={(e) => setReqStock(e.target.value)}
//                 />
//               </div>

//               {/* Submit Button */}
//               <div style={{ width: "45%", alignSelf: "end" }}>
//                 <Button onClick={handleMasterSubmit} className="w-100">
//                   Submit
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProduct;

import { useState, useEffect } from "react";
import {
  createUnit,
  createLocationCode,
  createManufacturer,
  createSupplier,
  createMasterType,
  addLabMasterApi,
  getMastertyApi,
} from "../../../services/AppinfoService";
import { Button, Card } from "react-bootstrap";
import LabNavigation1 from "../homeLab/LabNavigation1";

const AddProduct = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [masterTypes, setMasterTypes] = useState([]);
  const [masterType, setMasterType] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [units, setUnits] = useState("");
  const [reqStock, setReqStock] = useState("");

  const [data, setData] = useState({
    location: [],
    manufacturer: [],
    supplier: [],
    name: [],
  });

  const handleSubmit = async () => {
    if (!selectedCategory || !inputValue) {
      alert("Please select a category and enter a value.");
      return;
    }

    try {
      if (selectedCategory === "Location") {
        await createLocationCode(inputValue, userDetails.name);
      } else if (selectedCategory === "Manufacturer") {
        await createManufacturer(inputValue, userDetails.name);
      } else if (selectedCategory === "Supplier") {
        await createSupplier(inputValue, userDetails.name);
      } else if (selectedCategory === "Master") {
        await createMasterType(inputValue);
      }

      setData((prev) => ({
        ...prev,
        [selectedCategory.toLowerCase()]: [
          ...(prev[selectedCategory.toLowerCase()] || []),
          inputValue,
        ],
      }));

      alert(`${selectedCategory} added successfully!`);
      setInputValue("");
    } catch (error) {
      alert(`Failed to add ${selectedCategory}.`);
    }
  };

  const handleMasterSubmit = async () => {
    if (!masterType || !itemCode || !itemName || !units || !reqStock) {
      alert("Please fill out all fields.");
      return;
    }

    const masterData = {
      master_type: masterType,
      item_code: itemCode,
      item_name: itemName,
      min_req_stock: reqStock,
      units: units,
    };

    try {
      await addLabMasterApi(masterData, userDetails);
      alert("Data added successfully");
      setMasterType("");
      setItemCode("");
      setItemName("");
      setUnits("");
      setReqStock("");
    } catch (error) {
      alert("Failed to add data.");
    }
  };

  useEffect(() => {
    const fetchMasterTypes = async () => {
      try {
        const data = await getMastertyApi();
        setMasterTypes(data);
      } catch (error) {
        console.error("Error fetching Master Types:", error);
      }
    };
    fetchMasterTypes();
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "85vh",
        backgroundColor: "#f8f9fa",
        paddingTop: "20px",
      }}
    >
      <div
        className="p-4 border rounded shadow-lg bg-white"
        style={{ width: "75%", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="d-flex gap-4">
          {/* Category Management Card */}
          <Card style={{ width: "35%" }}>
            <Card.Header>
              <strong>Category Management</strong>
            </Card.Header>
            <Card.Body>
              <label className="form-label">Select Category</label>
              <select
                value={selectedCategory}
                className="form-control"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">-- Select --</option>
                <option value="Master">Master Type</option>
                <option value="Location">Location</option>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Supplier">Supplier</option>
              </select>

              {selectedCategory && (
                <div className="mt-3">
                  <label className="form-label">{selectedCategory} Name</label>
                  <input
                    type="text"
                    value={inputValue}
                    className="form-control"
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Button onClick={handleSubmit} className="w-100 mt-2">
                    Add {selectedCategory}
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Master Item Entry Card */}
          <Card style={{ width: "65%" }}>
            <Card.Header>
              <strong>Master Item Entry</strong>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <div style={{ width: "48%" }}>
                  <label className="form-label">Master Type</label>
                  <select
                    value={masterType}
                    className="form-control"
                    onChange={(e) => setMasterType(e.target.value)}
                  >
                    <option value="">Select Master Type</option>
                    {masterTypes.map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ width: "48%" }}>
                  <label className="form-label">Unit</label>
                  <input
                    type="text"
                    value={units}
                    className="form-control"
                    onChange={(e) => setUnits(e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <div style={{ width: "48%" }}>
                  <label className="form-label">Item Name</label>
                  <input
                    type="text"
                    value={itemName}
                    className="form-control"
                    onChange={(e) => setItemName(e.target.value)}
                  />
                </div>

                <div style={{ width: "48%" }}>
                  <label className="form-label">Item Code</label>
                  <input
                    type="text"
                    value={itemCode}
                    className="form-control"
                    onChange={(e) => setItemCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <div style={{ width: "48%" }}>
                  <label className="form-label">Minimum Required Stock</label>
                  <input
                    type="text"
                    value={reqStock}
                    className="form-control"
                    onChange={(e) => setReqStock(e.target.value)}
                  />
                </div>

                <div style={{ width: "48%", alignSelf: "end" }}>
                  <Button onClick={handleMasterSubmit} className="w-100">
                    Submit
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
