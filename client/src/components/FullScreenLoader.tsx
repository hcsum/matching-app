import { Backdrop, CircularProgress, Typography } from "@mui/material";

const FullScreenLoader = ({
  loading,
  content,
}: {
  loading: boolean;
  content?: string;
}) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: "column",
      }}
      open={loading}
    >
      <CircularProgress color="inherit" />
      {content && <Typography mt={4}>{content}</Typography>}
    </Backdrop>
  );
};

export default FullScreenLoader;
