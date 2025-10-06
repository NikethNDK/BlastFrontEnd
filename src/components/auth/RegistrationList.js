import React, { useEffect, useState } from "react";
import {
  fetchRegistrations,
  deleteRegistration,
} from "../../services/AppinfoService";
import toast from "react-hot-toast";

const RegistrationList = () => {
  const [registrations, setRegistrations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const loadRegistrations = async () => {
    try {
      const data = await fetchRegistrations();
      setRegistrations(data);
    } catch (error) {
      setErrorMessage("Failed to fetch registrations.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRegistration(id);
      setRegistrations((prev) => prev.filter((reg) => reg.id !== id));
      toast.success("Registration deleted successfully!");
    } catch (error) {
      toast.error("Error deleting the registration.");
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  return (
    <div className="registration-list">
      <h2>Registrations</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <ul>
        {registrations.map((reg) => (
          <li key={reg.id}>
            {reg.username} ({reg.employee_id}) - Lab: {reg.lab}
            <button onClick={() => handleDelete(reg.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegistrationList;
