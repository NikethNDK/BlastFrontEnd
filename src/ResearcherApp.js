// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Home from "./components/Home";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import ResearcherNavigation from "./components/researcher/ResearcherNavigation";
// import ReNotification from "./components/researcher/ReNotification";
// import AddProductListReq from "./components/researcher/AddProductListReq";
// import IssueNotify from "./components/researcher/IssueNotify";
// import HomeLab from "./components/researcher/inventoryView";
// import DnaManage from "./repository/dna/DnaManage";
// import CommonNameDna from "./repository/dna/CommonNameDna";
// import ScientificNameDna from "./repository/dna/ScientificNameDna";
// import AddDNA from "./repository/dna/addDna/AddDna";
// import Comparision from "../src/blast/comparision";
// import ChangePassword from "./components/researcher/ChangePassword";
// import JoinResearcher from "./researcher_jump";
// function ResearcherApp({ userDetails = { name: '', lab: '', designation: '' } }) {
//   return (
//     <BrowserRouter>
//       {/* <ResearcherNavigation /> */}
//       <Routes>
//         <Route path="/" element={<JoinResearcher  userDetails={userDetails}/>} />
//         <Route exact path="/home" element={<Home  userDetails={userDetails} />} />
//         <Route exact path="/re_notify" element={<IssueNotify  userDetails={userDetails} />} />
//         <Route path="/masters" element={<HomeLab  userDetails={userDetails}/>} />
//         <Route exact path="/addProductReq" element={<AddProductListReq  userDetails={userDetails}/>} />
//         <Route path="/dna" element={<DnaManage userDetails={userDetails} />} />
//         <Route path="/common_name" element={<CommonNameDna userDetails={userDetails} />} />
//         <Route path="/scientific_name" element={<ScientificNameDna userDetails={userDetails} />} />
//         <Route path="/add_dna" element={<AddDNA  userDetails={userDetails}/>} />
//         <Route path="/add_blast" element={<Comparision userDetails={userDetails} />} />
//         <Route path="/change_password" element={<ChangePassword  userDetails={userDetails} />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default ResearcherApp;
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ResearcherNavigation from "./components/researcher/ResearcherNavigation";
import ReNotification from "./components/researcher/ReNotification";
import AddProductListReq from "./components/researcher/AddProductListReq";
import IssueNotify from "./components/researcher/IssueNotify";
import HomeLab from "./components/researcher/inventoryView";
import ChangePassword from "./components/researcher/ChangePassword";
import JoinResearcher from "./researcher_jump";

function Layout({ userDetails }) {
  const location = useLocation();
  // Hide navigation only on JoinLab ("/") route
  const hiddenPaths = ["/", "/add_blast","/dna","/add_dna"];
  const hideNavigation = hiddenPaths.includes(location.pathname);
  return (
    <>
      {!hideNavigation && <ResearcherNavigation userDetails={userDetails}/>}
      <Routes>
        <Route path="/" element={<JoinResearcher userDetails={userDetails} />} />
        <Route path="/home" element={<Home userDetails={userDetails} />} />
        <Route path="/re_notify" element={<IssueNotify userDetails={userDetails} />} />
        <Route path="/masters" element={<HomeLab userDetails={userDetails} />} />
        <Route path="/addProductReq" element={<AddProductListReq userDetails={userDetails} />} />
        <Route path="/change_password" element={<ChangePassword userDetails={userDetails} />} />
      </Routes>
    </>
  );
}

function ResearcherApp({ userDetails = { name: '', lab: '', designation: '' } }) {
  return (
    <BrowserRouter>
      <Layout userDetails={userDetails} />
    </BrowserRouter>
  );
}

export default ResearcherApp;
