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
import Loading from "../Loading";
import axios from "../axios";

const formatMoney = (value) => Math.round(value || 0).toLocaleString();
const propertyCount = (item, level) =>
  item.propertyCounts?.[`level${level}`] || 0;

const AccountingResult = () => {
  const { role } = useContext(RoleContext);
  const location = useLocation();
  const navigate = useNavigate();
  const hasNavigationResult = Array.isArray(location.state?.results);
  const [results, setResults] = React.useState(location.state?.results || []);
  const [count, setCount] = React.useState(location.state?.count);
  const [loading, setLoading] = React.useState(!hasNavigationResult);

  React.useEffect(() => {
    if (role !== "admin") {
      navigate("/permission");
      return undefined;
    }

    if (hasNavigationResult) return undefined;

    let ignore = false;
    axios
      .get("/accounting")
      .then((res) => {
        if (ignore) return;
        const latestResult = res.data?.latestResult;
        setCount(latestResult?.count);
        setResults(latestResult?.results || []);
      })
      .catch(() => {
        if (!ignore) setResults([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 10,
          marginBottom: "calc(88px + env(safe-area-inset-bottom))",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Final Accounting Result
        </Typography>
        {count ? (
          <Typography sx={{ marginTop: 1, color: "gray" }}>
            Final accounting run #{count}
          </Typography>
        ) : null}
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
          <>
            <TableContainer
              component={Paper}
              sx={{
                marginTop: 3,
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                width: "100%",
              }}
            >
              <Table
                aria-label="final-accounting-result"
                size="small"
                sx={{ minWidth: 720 }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Team</TableCell>
                    <TableCell align="center">現金</TableCell>
                    <TableCell align="center">物資價值</TableCell>
                    <TableCell align="center">房地產價值</TableCell>
                    <TableCell align="center">破產次數</TableCell>
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
                      <TableCell align="center">
                        {item.bankruptcyCount || 0}
                      </TableCell>
                      <TableCell align="center">{formatMoney(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography component="h2" variant="h6" sx={{ marginTop: 4 }}>
              房地產數量
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                marginTop: 1,
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                width: "100%",
              }}
            >
              <Table
                aria-label="property-level-counts"
                size="small"
                sx={{ minWidth: 520 }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Team</TableCell>
                    <TableCell align="center">一級房地產</TableCell>
                    <TableCell align="center">二級房地產</TableCell>
                    <TableCell align="center">三級房地產</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((item) => (
                    <TableRow key={item.teamId}>
                      <TableCell align="center">{item.teamname}</TableCell>
                      <TableCell align="center">{propertyCount(item, 1)}</TableCell>
                      <TableCell align="center">{propertyCount(item, 2)}</TableCell>
                      <TableCell align="center">{propertyCount(item, 3)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </Container>
  );
};

export default AccountingResult;
