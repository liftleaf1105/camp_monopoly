import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CollectionsIcon from "@mui/icons-material/Collections";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import ImageIcon from "@mui/icons-material/Image";
import TuneIcon from "@mui/icons-material/Tune";
import RoleContext from "./useRole";

const STAGE_COUNT = 42;
const IMAGE_EXTENSIONS = ["jpg", "png", "webp", "jpeg"];
const STORAGE_KEY = "stageDisplaySelectedStage";

const getStageLabel = (stage) => `Stage ${String(stage).padStart(2, "0")}`;
const getImageSrc = (stage, extIndex) =>
  `/stage-art/stage-${String(stage).padStart(2, "0")}.${
    IMAGE_EXTENSIONS[extIndex]
  }`;

const StageDisplay = () => {
  const navigate = useNavigate();
  const { roleId, setNavBarId } = useContext(RoleContext);
  const [selectedStage, setSelectedStage] = useState(() => {
    const saved = Number(localStorage.getItem(STORAGE_KEY));
    return saved >= 1 && saved <= STAGE_COUNT ? saved : "";
  });
  const [imageExtIndex, setImageExtIndex] = useState(0);
  const [imageMissing, setImageMissing] = useState(false);
  const [fitMode, setFitMode] = useState("contain");
  const [showPicker, setShowPicker] = useState(selectedStage === "");

  const stages = useMemo(
    () => Array.from({ length: STAGE_COUNT }, (_, index) => index + 1),
    []
  );

  const imageSrc =
    selectedStage === "" || imageMissing
      ? ""
      : getImageSrc(selectedStage, imageExtIndex);

  useEffect(() => {
    if (roleId < 50) return;
    if (selectedStage === "") return;
    localStorage.setItem(STORAGE_KEY, String(selectedStage));
    setImageExtIndex(0);
    setImageMissing(false);
  }, [roleId, selectedStage]);

  useEffect(() => {
    if (roleId < 50) {
      navigate("/permission");
      setNavBarId(0);
    }
  }, [roleId, navigate, setNavBarId]);

  const handleImageError = () => {
    if (imageExtIndex + 1 < IMAGE_EXTENSIONS.length) {
      setImageExtIndex(imageExtIndex + 1);
    } else {
      setImageMissing(true);
    }
  };

  const handleFullscreen = () => {
    const target = document.documentElement;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (target.requestFullscreen) {
      target.requestFullscreen();
    }
  };

  const handleStageChange = (event) => {
    setSelectedStage(event.target.value);
    setShowPicker(false);
  };

  const handleCloseDisplay = async () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      await document.exitFullscreen();
    }
    navigate("/");
  };

  if (roleId < 50) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        bgcolor: "#080808",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      {selectedStage !== "" && !imageMissing ? (
        <Box
          component="img"
          src={imageSrc}
          alt={getStageLabel(selectedStage)}
          onError={handleImageError}
          sx={{
            width: "100vw",
            height: "100vh",
            objectFit: fitMode,
            objectPosition: "center",
            display: "block",
            bgcolor: "#080808",
          }}
        />
      ) : (
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #101010 0%, #1f2933 52%, #111827 100%)",
          }}
        >
          <Container maxWidth="sm">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 2,
              }}
            >
              <ImageIcon sx={{ fontSize: 72, opacity: 0.85 }} />
              <Typography variant="h4" component="h1">
                {selectedStage === ""
                  ? "Select Stage"
                  : `${getStageLabel(selectedStage)} Image Missing`}
              </Typography>
              {selectedStage !== "" ? (
                <Typography variant="body1" sx={{ opacity: 0.78 }}>
                  Upload stage-{String(selectedStage).padStart(2, "0")}.jpg to
                  frontend/public/stage-art
                </Typography>
              ) : null}
            </Box>
          </Container>
        </Box>
      )}

      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: "rgba(0, 0, 0, 0.48)",
          borderRadius: 1,
          px: 1,
          py: 0.75,
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography variant="body2" sx={{ minWidth: 68, textAlign: "center" }}>
          {selectedStage === "" ? "--" : getStageLabel(selectedStage)}
        </Typography>
        <IconButton
          color="inherit"
          size="small"
          onClick={() => setShowPicker(!showPicker)}
          aria-label="select stage"
        >
          <CollectionsIcon />
        </IconButton>
        <ToggleButtonGroup
          value={fitMode}
          exclusive
          size="small"
          onChange={(event, nextMode) => {
            if (nextMode) setFitMode(nextMode);
          }}
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.08)",
            "& .MuiToggleButton-root": {
              color: "#fff",
              borderColor: "rgba(255, 255, 255, 0.25)",
              px: 1,
            },
            "& .Mui-selected": {
              color: "#111",
              bgcolor: "#fff",
            },
          }}
        >
          <ToggleButton value="contain" aria-label="fit full image">
            Fit
          </ToggleButton>
          <ToggleButton value="cover" aria-label="fill screen">
            Fill
          </ToggleButton>
        </ToggleButtonGroup>
        <IconButton
          color="inherit"
          size="small"
          onClick={handleFullscreen}
          aria-label="fullscreen"
        >
          <FullscreenIcon />
        </IconButton>
        <IconButton
          color="inherit"
          size="small"
          onClick={handleCloseDisplay}
          aria-label="close display"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {showPicker ? (
        <Box
          sx={{
            position: "absolute",
            top: { xs: 72, sm: 76 },
            right: 12,
            width: { xs: "calc(100vw - 24px)", sm: 320 },
            bgcolor: "rgba(16, 24, 39, 0.94)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            borderRadius: 1,
            p: 2,
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.35)",
          }}
        >
          <FormControl variant="standard" fullWidth>
            <InputLabel id="stage-display-select-label" sx={{ color: "#ddd" }}>
              Stage
            </InputLabel>
            <Select
              labelId="stage-display-select-label"
              value={selectedStage}
              onChange={handleStageChange}
              MenuProps={{
                sx: { zIndex: 2200 },
                PaperProps: {
                  sx: {
                    maxHeight: "min(70vh, 420px)",
                    bgcolor: "#111827",
                    color: "#fff",
                  },
                },
              }}
              sx={{
                color: "#fff",
                "&:before": { borderBottomColor: "rgba(255,255,255,0.45)" },
                "&:after": { borderBottomColor: "#fff" },
                "& .MuiSvgIcon-root": { color: "#fff" },
              }}
            >
              {stages.map((stage) => (
                <MenuItem value={stage} key={stage}>
                  {getStageLabel(stage)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            fullWidth
            disabled={selectedStage === ""}
            onClick={() => setShowPicker(false)}
            startIcon={<TuneIcon />}
            sx={{ mt: 2 }}
          >
            Display
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

export default StageDisplay;
