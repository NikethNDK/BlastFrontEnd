import React, { useEffect, useState } from "react";
import "./HomeLab.css";
import {
  getStockLevelApi,
} from "../../../services/AppinfoService";
import MasterListTable from "./inventory";
import { PageLayout, PageHeader, PageToolbar, PageBody, ContentCard } from "../../layout/content";

const HomeLab = ({ userDetails = { name: '', lab: '', designation: '' } }) => {
  const [selectedMasterType, setSelectedMasterType] = useState("");
  const [stockLevel, setStockLevel] = useState("");

  const inventoryTypes = ["Labware", "Chemical", "Equipment"];

  useEffect(() => {
    getStockLevelApi()
      .then((response) => response.json())
      .then((data) => {
        setStockLevel(data.stock_level);
      })
      .catch((error) => {
        console.error("Error fetching stock level:", error);
        setStockLevel("Stock Level Unknown");
      });

    if (inventoryTypes.length > 0) {
      setSelectedMasterType(inventoryTypes[0]);
    }
  }, []);
  console.log('stock level', stockLevel)

  const handleMasterTypeSelection = (type) => {
    setSelectedMasterType(type);
  };

  const getStockLevelBadgeClass = () => {
    if (stockLevel.includes("Sufficient")) {
      return "lims-meta-badge--success";
    } else if (stockLevel.includes("Reorder")) {
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
        title="Inventory management"
        meta={
          <div className={`lims-meta-badge ${getStockLevelBadgeClass()}`}>
            {stockLevel}
          </div>
        }
      />
      <PageToolbar
        items={toolbarItems}
        activeId={selectedMasterType}
        onChange={handleMasterTypeSelection}
      />
      <PageBody>
        <ContentCard flush>
          <MasterListTable masterType={selectedMasterType} />
        </ContentCard>
      </PageBody>
    </PageLayout>
  );
};

export default HomeLab;