import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import RoleContext from "../useRole";

const formatMoney = (value) => Math.round(value || 0).toLocaleString();

const AccountingResult = () => {
  const { role } = useContext(RoleContext);
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results || [];

  React.useEffect(() => {
    if (role !== "admin") {
      navigate("/permission");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 10,
          marginBottom: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Final Accounting Result
        </Typography>
        {results.length === 0 ? (
          <>
            <Typography sx={{ marginTop: 2, color: "gray" }}>
              No accounting result to show.
            </Typography>
            <Button
              variant="contained"
              sx={{ marginTop: 2 }}
              onClick={() => navigate("/accounting")}
            >
              Back to Accounting
            </Button>
          </>
        ) : (
          <TableContainer component={Paper} sx={{ marginTop: 3 }}>
            <Table aria-label="final-accounting-result" size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Team</TableCell>
                  <TableCell align="center">現金</TableCell>
                  <TableCell align="center">物資價值</TableCell>
                  <TableCell align="center">房地產價值</TableCell>
                  <TableCell align="center">總和</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((item) => (
                  <TableRow key={item.teamId}>
                    <TableCell align="center">{item.teamname}</TableCell>
                    <TableCell align="center">{formatMoney(item.cash)}</TableCell>
                    <TableCell align="center">
                      {formatMoney(item.resourceValue)}
                    </TableCell>
                    <TableCell align="center">
                      {formatMoney(item.propertyValue)}
                    </TableCell>
                    <TableCell align="center">{formatMoney(item.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default AccountingResult;
