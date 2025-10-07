import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/lab-design-system.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ModernSidebar from "./components/common/ModernSidebar";
import ModernHeader from "./components/common/ModernHeader";
import Header from "./components/Lab1/homeLab/Header";
// import StatsDashboard from "./components/common/StatsDashboard";
import HomeLab from "../src/components/Lab1/homeLab/HomeLab";
import AddProduct from "./components/Lab1/addProduct/AddProduct";
import ReceivedProduct from "./components/Lab1/receive/ReceivedProduct";
import IssuedProduct from "./components/Lab1/issue/IssuedProduct";
import ChemicalList from "./components/Lab1/homeLab/ChemicalList";
import ReturnProduct from "./components/Lab1/return/return";
import TransferredDataTable from "./components/Lab1/entries/entry";
import ChemicalIssuePage from "./components/Lab1/entries/dropdown";
import IssueDataTable from "./components/Lab1/entries/issuetable";
import ReceivedDataTable from "./components/Lab1/entries/receivedTable";
import DnaManage from "./repository/dna/DnaManage";
import CommonNameDna from "./repository/dna/CommonNameDna";
import ScientificNameDna from "./repository/dna/ScientificNameDna";
import AddDNA from "./repository/dna/addDna/AddDna";
import Comparision from "../src/blast/comparision";
import ReturnDataTable from "./components/Lab1/entries/return";
import ChangePassword from "./components/Lab1/homeLab/ChangePassword";
import JoinLab from "./lab_jump";
import EquipmentList from "./components/Lab1/homeLab/equipmentList";

function Layout({ userDetails }) {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  // const [stats, setStats] = useState({});
  // const [loading, setLoading] = useState(true);

  // Hide navigation only on JoinLab ("/") route
  const hiddenPaths = ["/", "/add_blast", "/dna", "/add_dna"];
  const hideNavigation = hiddenPaths.includes(location.pathname);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:8000/get-issue-items/?status=LAB-OPEN");
        const data = await response.json();
        if (data) {
          setNotifications(data);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      }
    };

    if (!hideNavigation) {
      fetchNotifications();
    }
  }, [hideNavigation]);

  // Fetch stats
  // useEffect(() => {
  //   const fetchStats = async () => {
  //     setLoading(true);
  //     try {
  //       // Mock stats for now - replace with actual API calls
  //       const mockStats = {
  //         totalItems: 1250,
  //         receivedItems: 45,
  //         issuedItems: 32,
  //         returnedItems: 8,
  //         lowStockItems: 12,
  //         dnaSequences: 89,
  //         equipmentCount: 156,
  //         pendingRequests: 5
  //       };
  //       setStats(mockStats);
  //     } catch (error) {
  //       console.error("Error fetching stats:", error);
  //       setStats({});
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (!hideNavigation) {
  //     fetchStats();
  //   }
  // }, [hideNavigation]);

  const handleNotificationClick = async (notification) => {
    try {
      const payload = {
        id: notification.entry_no,
        status: "LAB-OPEN",
      };

      const response = await fetch("http://localhost:8000/update-issue-items/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Item has been closed.");
        // Remove notification from state
        setNotifications(prev => prev.filter(n => n.entry_no !== notification.entry_no));
      } else {
        console.error("Failed to close item");
      }
    } catch (error) {
      console.error("Error closing item:", error);
    }
  };

  const handleLogout = () => {
    // Add logout logic here
    window.location.href = '/';
  };

  const getPageTitle = (pathname) => {
    const titles = {
      '/master': 'Inventory Dashboard',
      '/add_product': 'Add New Product',
      '/received_product': 'Add Received Item',
      '/issued_product': 'Add Issued Item',
      '/issuetable': 'Issued Items',
      '/return_product': 'Add Returned Item',
      '/chemical_list': 'Chemical List',
      '/transferred': 'Transferred Items',
      '/received_issue': 'Received Issues',
      '/returntable': 'Received Data',
      '/dna': 'DNA Repository',
      '/common_name': 'Common Name DNA',
      '/scientific_name': 'Scientific Name DNA',
      '/add_dna': 'Add DNA Sequence',
      '/add_blast': 'DNA Blast Analysis',
      '/retrun': 'Return Data',
      '/change_password': 'Change Password',
      '/equipment': 'Equipment Management'
    };
    return titles[pathname] || 'Lab Assistant';
  };

  const getPageSubtitle = (pathname) => {
    const subtitles = {
      '/master': 'Overview of your laboratory inventory and statistics',
      '/add_product': 'Add new items to your inventory',
      '/received_product': 'Record newly received items',
      '/issued_product': 'Record items issued to researchers',
      '/issuetable': 'View all issued items and their status',
      '/return_product': 'Record items returned to inventory',
      '/chemical_list': 'Manage chemical inventory',
      '/transferred': 'Track item transfers between labs',
      '/received_issue': 'Handle received item issues',
      '/returntable': 'View received item data',
      '/dna': 'Manage DNA sequence repository',
      '/common_name': 'Search DNA by common name',
      '/scientific_name': 'Search DNA by scientific name',
      '/add_dna': 'Add new DNA sequences',
      '/add_blast': 'Perform BLAST analysis on DNA sequences',
      '/retrun': 'View return item data',
      '/change_password': 'Update your account password',
      '/equipment': 'Manage laboratory equipment'
    };
    return subtitles[pathname] || 'Manage your laboratory efficiently';
  };

  if (hideNavigation) {
    return (
      <Routes>
        <Route path="/" element={<JoinLab />} />
        <Route path="/add_blast" element={<Comparision userDetails={userDetails} />} />
        <Route path="/dna" element={<DnaManage userDetails={userDetails} />} />
        <Route path="/add_dna" element={<AddDNA userDetails={userDetails} />} />
      </Routes>
    );
  }

  return (
    <div className="lab-app">
      <Header/>
      <div className="lab-body-container">
        <ModernSidebar
          userDetails={userDetails}
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onLogout={handleLogout}
        />
        
        <div className={`lab-main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
          {/* <ModernHeader
            title={getPageTitle(location.pathname)}
            subtitle={getPageSubtitle(location.pathname)}
            userDetails={userDetails}
            notifications={notifications}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            onNotificationClick={handleNotificationClick}
            onLogout={handleLogout}
          /> */}
          
          <div className="lab-content-container">
            <Routes>
              <Route path="/master" element={
                <div>
                  {/* <StatsDashboard stats={stats} loading={loading} /> */}
                  
                  <HomeLab userDetails={userDetails} />
                </div>
              } />
              <Route path="/add_product" element={<AddProduct userDetails={userDetails} />} />
              <Route path="/received_product" element={<ReceivedProduct userDetails={userDetails} />} />
              <Route path="/issued_product" element={<IssuedProduct userDetails={userDetails} />} />
              <Route path="/issuetable" element={<IssueDataTable userDetails={userDetails} />} />
              <Route path="/return_product" element={<ReturnProduct userDetails={userDetails} />} />
              <Route path="/chemical_list" element={<ChemicalList userDetails={userDetails} />} />
              <Route path="/transferred" element={<TransferredDataTable userDetails={userDetails} />} />
              <Route path="/received_issue" element={<ChemicalIssuePage userDetails={userDetails} />} />
              <Route path="/returntable" element={<ReceivedDataTable userDetails={userDetails} />} />
              <Route path="/dna" element={<DnaManage userDetails={userDetails} />} />
              <Route path="/common_name" element={<CommonNameDna userDetails={userDetails}/>} />
              <Route path="/scientific_name" element={<ScientificNameDna userDetails={userDetails} />} />
              <Route path="/add_dna" element={<AddDNA userDetails={userDetails} />} />
              <Route path="/add_blast" element={<Comparision userDetails={userDetails} />} />
              <Route path="/retrun" element={<ReturnDataTable userDetails={userDetails} />} />
              <Route path="/change_password" element={<ChangePassword userDetails={userDetails} />} />
              <Route path="/equipment" element={<EquipmentList userDetails={userDetails} />} />
            </Routes>
          </div>
        </div>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

function LabApp({ userDetails = { name: '', lab: '', designation: '' } }) {
  return (
    <BrowserRouter>
      <Layout userDetails={userDetails} />
    </BrowserRouter>
  );
}

export default LabApp;
