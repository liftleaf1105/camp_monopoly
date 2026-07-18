import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const loveConversion = [
  { qty: 1, discount: "5%" },
  { qty: 2, discount: "7.50%" },
  { qty: 3, discount: "10%" },
  { qty: 4, discount: "12.50%" },
  { qty: 5, discount: "15%" },
  { qty: 6, discount: "16.50%" },
  { qty: 7, discount: "18%" },
  { qty: 8, discount: "19.50%" },
  { qty: 9, discount: "21%" },
  { qty: 10, discount: "22.50%" },
  { qty: 11, discount: "24%" },
  { qty: 12, discount: "25.50%" },
  { qty: 13, discount: "27%" },
  { qty: 14, discount: "28.50%" },
  { qty: 15, discount: "30%" },
];

const LOVE_ITEMS_PER_COLUMN = 4;
const LOVE_COLUMN_GROUPS = Math.ceil(
  loveConversion.length / LOVE_ITEMS_PER_COLUMN
);

const LoveConversionTable = () => (
  <Box sx={{ marginTop: "40px" }}>
    <Typography
      variant="h6"
      align="center"
      sx={{
        fontWeight: 500,
        marginBottom: "10px",
        userSelect: "none",
      }}
    >
      贖罪券
    </Typography>
    <TableContainer
      sx={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}
    >
      <Table size="small" aria-label="love conversion table" sx={{ minWidth: 560 }}>
        <TableHead>
          <TableRow>
            {Array.from({ length: LOVE_COLUMN_GROUPS }).map(
              (_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <TableCell
                    align="center"
                    sx={{ py: 0.5 }}
                    style={{ fontWeight: 800, userSelect: "none" }}
                  >
                    持有數量
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      py: 0.5,
                      borderRight:
                        groupIndex < LOVE_COLUMN_GROUPS - 1
                          ? "1px solid rgba(0,0,0,0.12)"
                          : "none",
                    }}
                    style={{ fontWeight: 800, userSelect: "none" }}
                  >
                    過路費減免量
                  </TableCell>
                </React.Fragment>
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: LOVE_ITEMS_PER_COLUMN }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: LOVE_COLUMN_GROUPS }).map(
                (_, groupIndex) => {
                  const item =
                    loveConversion[
                      groupIndex * LOVE_ITEMS_PER_COLUMN + rowIndex
                    ];

                  return (
                    <React.Fragment key={groupIndex}>
                      <TableCell
                        align="center"
                        sx={{ py: 0.5 }}
                        style={{ userSelect: "none" }}
                      >
                        {item ? item.qty : ""}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          py: 0.5,
                          borderRight:
                            groupIndex < LOVE_COLUMN_GROUPS - 1
                              ? "1px solid rgba(0,0,0,0.12)"
                              : "none",
                        }}
                        style={{ userSelect: "none" }}
                      >
                        {item ? item.discount : ""}
                      </TableCell>
                    </React.Fragment>
                  );
                }
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

export default LoveConversionTable;
