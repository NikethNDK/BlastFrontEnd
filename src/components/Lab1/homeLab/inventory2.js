import React, { useState, useEffect } from "react";
import { fetchMasterListByType } from "../../../services/AppinfoService"; // Adjust path if needed

const MasterListTable = ({ masterType }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);
                const response = await fetchMasterListByType(masterType);
                console.log("API Response:", response); // Debugging log

                // Merge both arrays
                const combinedData = [
                    ...(response.master_data || []), 
                    ...(response.second_model_data || [])
                ];
                
                setData(combinedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (masterType) {
            getData();
        }
    }, [masterType]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Master List - {masterType}</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Master Type</th>
                     
                        <th>Item Code</th>
                        <th>Item Name</th>
                        <th> Stock</th>
                        <th>Unit</th>
                        <th>Min Req Stock</th>
                        <th>Location Code</th>

                        <th>Project Code</th>
                    
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <tr key={`${item.entry_no}-${index}`}>
                                <td>{item.master_type || "-"}</td>
                                <td>{item.item_code || "-"}</td>
                                <td>{item.item_name || "-"}</td>
                                <td>{item.quantity_received || "-"}</td>

                                <td>{item.price_unit || "-"}</td>
                                <td>{item.quantity_received || "-"}</td>

                                
                                <td>{item.location || "-"}</td>
                                <td>{item.project_code || "-"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="12">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MasterListTable;
