import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import FunctionsIcon from "@mui/icons-material/Functions";
import RoleContext from "../useRole";
import axios from "../axios";

const Accounting = () => {
  const [submitting, setSubmitting] = useState(false);
  const { role } = useContext(RoleContext);
  const navigate = useNavigate();

  const handleAccounting = async () => {
    setSubmitting(true);
    try {
      const { data } = await axios.post("/accounting");
      navigate("/accounting-result", { state: { results: data.results || [] } });
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (role !== "admin") {
      navigate("/permission");
    }
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
          onClick={handleAccounting}
          disabled={submitting}
          fullWidth
          sx={{ marginTop: 2 }}
        >
          <FunctionsIcon sx={{ marginRight: 1 }} />
          Final Accounting
        </Button>
      </Box>
    </Container>
  );
};

export default Accounting;
