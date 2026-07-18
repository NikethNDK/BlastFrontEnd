import React, { useState, useEffect } from "react";
import {
  addLabApi,
  addDesignationApi,
  getLabsApi,
  getDesignationsApi,
  deleteLabApi,
  deleteDesignationApi,
  updateLabApi,
} from "../../services/AppinfoService";
import toast from "react-hot-toast";
import {
  Container,
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
  Switch,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { PageLayout, PageHeader, PageBody, ContentCard } from "../layout/content";

const LabDesignationForm = ({
  userDetails = { name: "", lab: "", designation: "" },
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [dataList, setDataList] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

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
        (item) =>
          (item.name || item.title || "").toLowerCase() === newValue
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

  const startRename = (item) => {
    setEditingId(item.id);
    setEditingName(item.name || "");
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveRename = async (id) => {
    const trimmed = editingName.trim();
    if (!trimmed) {
      toast.error("Lab name cannot be empty");
      return;
    }
    const isDuplicate = dataList.some(
      (item) =>
        item.id !== id && item.name?.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      toast.error("Lab already exists!");
      return;
    }
    try {
      await updateLabApi(id, { name: trimmed });
      toast.success("Lab renamed successfully!");
      setEditingId(null);
      setEditingName("");
      fetchData();
    } catch (error) {
      toast.error(error.message || "Failed to rename lab");
    }
  };

  const handleFullAccessToggle = async (item, checked) => {
    try {
      await updateLabApi(item.id, { full_access: checked });
      setDataList((prev) =>
        prev.map((lab) =>
          lab.id === item.id ? { ...lab, full_access: checked } : lab
        )
      );
      toast.success(
        checked
          ? "Full access enabled (Blast + Repository)"
          : "Full access disabled (Inventory only)"
      );
    } catch (error) {
      toast.error(error.message || "Failed to update access");
    }
  };

  useEffect(() => {
    if (selectedOption) {
      setEditingId(null);
      setEditingName("");
      fetchData();
    }
  }, [selectedOption]);

  return (
    <PageLayout>
      <PageHeader title="Lab & designation form" />
      <PageBody>
      <ContentCard>
    <Container maxWidth="sm" disableGutters>

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
                {selectedOption === "Lab" && (
                  <TableCell align="center">
                    <strong>Full access</strong>
                  </TableCell>
                )}
                <TableCell align="right">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {selectedOption === "Lab" && editingId === item.id ? (
                      <TextField
                        size="small"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveRename(item.id);
                          if (e.key === "Escape") cancelRename();
                        }}
                        autoFocus
                        fullWidth
                      />
                    ) : (
                      item.name || item.title || `Unnamed (ID: ${item.id})`
                    )}
                  </TableCell>
                  {selectedOption === "Lab" && (
                    <TableCell align="center">
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={!!item.full_access}
                            onChange={(e) =>
                              handleFullAccessToggle(item, e.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label={item.full_access ? "On" : "Off"}
                        labelPlacement="end"
                      />
                    </TableCell>
                  )}
                  <TableCell align="right">
                    {selectedOption === "Lab" && editingId === item.id ? (
                      <>
                        <IconButton
                          color="primary"
                          onClick={() => saveRename(item.id)}
                          aria-label="Save rename"
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          onClick={cancelRename}
                          aria-label="Cancel rename"
                        >
                          <CloseIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        {selectedOption === "Lab" && (
                          <IconButton
                            color="primary"
                            onClick={() => startRename(item)}
                            aria-label="Rename lab"
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
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
      </ContentCard>
      </PageBody>
    </PageLayout>
  );
};

export default LabDesignationForm;
