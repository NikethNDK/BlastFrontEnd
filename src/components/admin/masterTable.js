import React, { useState, useEffect } from "react";
import {
  addLabApi,
  addDesignationApi,
  getLabsApi,
  getDesignationsApi,
  deleteLabApi,
  deleteDesignationApi,
} from "../../services/AppinfoService";
import toast from "react-hot-toast";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const LabDesignationForm = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [inputValue, setInputValue] = useState("");
  // const [message, setMessage] = useState("");
  const [dataList, setDataList] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      if (selectedOption === "Lab") {
        const response = await getLabsApi();
        console.log("Labs API Response:", response.data); // Debugging
        setDataList(response.data);
      } else if (selectedOption === "Designation") {
        const response = await getDesignationsApi();
        console.log("Labs API Response:", response.data); // Debugging
        setDataList(response.data);
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error}`);
      setOpenSnackbar(true);
    }
  };

  const handleSubmit = async () => {
    try {
      // Trim spaces and make comparison case-insensitive
      const newValue = inputValue.trim().toLowerCase();
  
      // Check if the value already exists in the list
      const isDuplicate = dataList.some(
        (item) => item.name?.toLowerCase() === newValue
      );
  
      if (isDuplicate) {
        toast.error(`${selectedOption} already exists!`);
        setOpenSnackbar(true);
        return; // Stop execution — don’t add duplicate
      }
  
      // Proceed with API call if not duplicate
      if (selectedOption === "Lab") {
        await addLabApi(inputValue);
      } else if (selectedOption === "Designation") {
        await addDesignationApi(inputValue);
      }
  
      toast.success(`${selectedOption} added successfully!`);
      setOpenSnackbar(true);
      setInputValue("");
      fetchData(); // Refresh list after adding
    } catch (error) {
      toast.error("Fill the field!");
      setOpenSnackbar(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (selectedOption === "Lab") {
        await deleteLabApi(id);
        toast.success("Lab deleted successfully!");
      } else if (selectedOption === "Designation") {
        await deleteDesignationApi(id);
        toast.success("Designation deleted successfully!");
      }

      setOpenSnackbar(true);
      fetchData(); // Refresh the table after deletion
    } catch (error) {
      toast.error(
        `Error deleting ${selectedOption.toLowerCase()}: ${
          error.error || "Something went wrong"
        }`
      );
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    if (selectedOption) {
      fetchData();
    }
  }, [selectedOption]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Lab & Designation Form
      </Typography>

      <Card variant="outlined">
        <CardContent>
          <TextField
            select
            fullWidth
            label="Select Option"
            value={selectedOption}
            onChange={(e) => {
              setSelectedOption(e.target.value);
              setInputValue("");
              setDataList([]); // Clear the table when changing selection
            }}
          >
            <MenuItem value="">-- Select --</MenuItem>
            <MenuItem value="Lab">Lab</MenuItem>
            <MenuItem value="Designation">Designation</MenuItem>
          </TextField>

          {selectedOption && (
            <div style={{ marginTop: "20px" }}>
              <TextField
                fullWidth
                label={`${selectedOption} Name`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Enter ${selectedOption} Name`}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
                style={{ marginTop: "10px" }}
              >
                Save
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {dataList.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>{selectedOption} Name</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.name || item.title || `Unnamed (ID: ${item.id})`}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="info">
          {message}
        </Alert>
      </Snackbar> */}
    </Container>
  );
};

export default LabDesignationForm;
