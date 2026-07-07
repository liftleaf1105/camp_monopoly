import {
    Container,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Typography,
    Box,
    Button,
    FormControl,
    TableContainer,
    TableRow,
    TableCell,
    Table,
    Paper,
    Grid,
    TableBody,
  } from "@mui/material";

const Help = () => {
return (
    <Container component="main" maxWidth="xs">
        <Box
            sx={{
                marginTop: 9,
                marginBottom: 9,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography component="h1" variant="h5" sx={{ marginBottom: 0 }}>
                Help Center
            </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{ marginBottom: 1, width: 120 }}
                        onClick={() => window.open("https://docs.google.com/document/d/1lmCTCfiQkok6AxNVji6PVGJ5dotwqzq7xNzDdWjORXM/edit", "_blank")}
                    >
                        隊輔須知
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ marginBottom: 1, width: 120 }}
                        onClick={() => window.open("https://docs.google.com/document/d/1hJ7guJ6CndYnsPq2GxAT8Z7rgyGOIWGgSjC96mGk2mU/edit", "_blank")}
                    >
                        NPC<br/>共同SOP
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ marginBottom: 1, width: 120 }}
                        onClick={() => window.open("https://docs.google.com/document/d/15w5tjrIHBJKwxPWuWpEKgcbYXX4ipqzR8VbaAuqoLOc/edit?usp=drive_link", "_blank")}
                    >
                        NPC SOP
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ marginBottom: 1, width: 120 }}
                        onClick={() => window.open("https://docs.google.com/spreadsheets/d/1J9-TY4O-zkLXBxuQDyMl87b6VFY9hGrt/edit?usp=drive_link&ouid=113752778377958120846&rtpof=true&sd=true", "_blank")}
                    >
                        技能卡
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ marginBottom: 1, width: 120 }}
                        onClick={() => window.open("https://docs.google.com/spreadsheets/d/1uOwBtqZWkz8dfhK-TYxJgbKdcwu1G4Hb5SYgd-DmB_M/edit?gid=0#gid=0", "_blank")}
                    >
                        陽春銀行
                    </Button>
                </Box>
        </Box>
    </Container>
);
};
export default Help;
