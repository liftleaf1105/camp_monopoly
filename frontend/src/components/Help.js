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
                        onClick={() => window.open("https://docs.google.com/document/d/112Ov2wWO-H4Xu87MtIAqP4dJLNHqWoiwh7QcN6CAVK0/edit?usp=sharing", "_blank")}
                    >
                        隊輔須知
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ marginBottom: 1, width: 120 }}
                        onClick={() => window.open("https://docs.google.com/document/d/11GH9yheoKv36xBBZXWQOGbXJMi2xVw4ukxkk7VAgpwI/edit?usp=sharing", "_blank")}
                    >
                        NPC<br/>共同SOP
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ marginBottom: 1, width: 120 }}
                        onClick={() => window.open("https://docs.google.com/document/d/1bjAB2_eAinl0ZAPEh7A5PLLGFcJAS4C9/edit?usp=sharing&ouid=106682632482462425429&rtpof=true&sd=true", "_blank")}
                    >
                        NPC SOP
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ marginBottom: 1, width: 120 }}
                        onClick={() => window.open("https://docs.google.com/spreadsheets/d/1Z5mC5BacueOd4XLLTMuWiILmZ0m0d_ac/edit?usp=sharing&ouid=106682632482462425429&rtpof=true&sd=true", "_blank")}
                    >
                        技能卡
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ marginBottom: 1, width: 120 }}
                        onClick={() => window.open("https://docs.google.com/spreadsheets/d/1tjoStZyLjO7kl39F8XMwOIc_UNDhhZt6s6Eif1652C8/edit?usp=sharing", "_blank")}
                    >
                        Backup
                    </Button>
                </Box>
        </Box>
    </Container>
);
};
export default Help;
