import React, { useEffect, useState } from "react";
import {
  getStockLevelApi,
  getMastertyApi,
} from "../../services/AppinfoService";
import MasterListTable from "./tableResearcher";
import { PageLayout, PageHeader, PageToolbar, PageBody, ContentCard } from "../layout/content";

const HomeLab = ({ userDetails = { name: "", lab: "", designation: "" } }) => {
  const [selectedMasterType, setSelectedMasterType] = useState("");
  const [stockLevel, setStockLevel] = useState("");
  const [masterTypes, setMasterTypes] = useState([]);

  const inventoryTypes = ["Labware", "Chemical", "Equipment"];

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

  useEffect(() => {
    getStockLevelApi()
      .then((response) => response.json())
      .then((data) => {
        setStockLevel(data.stock_level);
      })
      .catch((error) => {
        console.error("Error fetching stock level:", error);
        setStockLevel("Error fetching stock level");
      });
  }, []);

  const handleMasterTypeSelection = (type) => {
    setSelectedMasterType((prevType) => (prevType === type ? null : type));
  };

  const getStockLevelBadgeClass = () => {
    if (stockLevel === "Stock is Sufficient") {
      return "lims-meta-badge--success";
    }
    if (stockLevel === "Stock has to be Reorder") {
      return "lims-meta-badge--danger";
    }
    return "lims-meta-badge--neutral";
  };

  const toolbarItems = inventoryTypes.map((type) => ({
    id: type,
    label: `${type} Inventory`,
  }));

  return (
    <PageLayout>
      <PageHeader
        title="Inventory"
        meta={
          stockLevel ? (
            <div className={`lims-meta-badge ${getStockLevelBadgeClass()}`}>
              {stockLevel}
            </div>
          ) : null
        }
      />
      <PageToolbar
        items={toolbarItems}
        activeId={selectedMasterType}
        onChange={handleMasterTypeSelection}
      />
      {selectedMasterType && (
        <PageBody>
          <ContentCard flush>
            <MasterListTable masterType={selectedMasterType} />
          </ContentCard>
        </PageBody>
      )}
    </PageLayout>
  );
};

export default HomeLab;
