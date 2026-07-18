import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
} from "@mui/material";
import FunctionsIcon from "@mui/icons-material/Functions";
import RoleContext from "../useRole";
import axios from "../axios";

const Accounting = () => {
  const [submitting, setSubmitting] = useState(false);
  const [accountingCount, setAccountingCount] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState("");
  const { role } = useContext(RoleContext);
  const navigate = useNavigate();

  const openConfirmDialog = () => {
    setConfirmed(false);
    setMessage("");
    setConfirmOpen(true);
  };

  const closeConfirmDialog = () => {
    if (submitting) return;
    setConfirmOpen(false);
    setConfirmed(false);
  };

  const handleAccounting = async () => {
    setSubmitting(true);
    setMessage("");
    try {
      const { data } = await axios.post("/accounting");
      setAccountingCount(Number(data.count) || accountingCount + 1);
      setConfirmOpen(false);
      setConfirmed(false);
      navigate("/accounting-result", {
        state: { count: data.count, results: data.results || [] },
      });
    } catch (error) {
      setMessage("Failed to run final accounting.");
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (role !== "admin") {
      navigate("/permission");
      return;
    }
    axios
      .get("/accounting")
      .then((res) => setAccountingCount(Number(res.data?.count) || 0))
      .catch(() => setMessage("Failed to load accounting status."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Final Accounting
        </Typography>
        <Typography
          component="p"
          variant="subtitle2"
          sx={{ color: "gray", marginTop: 1, textAlign: "center" }}
        >
          Add 50% of each team's property value back to money.
        </Typography>
        <Button
          variant="contained"
          onClick={openConfirmDialog}
          disabled={submitting}
          fullWidth
          sx={{ marginTop: 2 }}
        >
          <FunctionsIcon sx={{ marginRight: 1 }} />
          Final Accounting
        </Button>
        <Typography
          component="p"
          variant="body2"
          sx={{ color: "gray", marginTop: 1, textAlign: "center" }}
        >
          已執行 {accountingCount} 次 final accounting
        </Typography>
        {message ? (
          <Alert severity="info" sx={{ marginTop: 2, width: "100%" }}>
            {message}
          </Alert>
        ) : null}
      </Box>
      <Dialog open={confirmOpen} onClose={closeConfirmDialog}>
        <DialogTitle>Confirm Final Accounting</DialogTitle>
        <DialogContent>
          <Typography sx={{ marginBottom: 2 }}>
            目前已經執行過 {accountingCount} 次 final accounting。
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>
            再次結算會再次把各小隊房地產價值的 50% 加回現金，且不會 reset 土地。
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
              />
            }
            label="我確認要再次執行 final accounting"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleAccounting}
            disabled={!confirmed || submitting}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Accounting;
