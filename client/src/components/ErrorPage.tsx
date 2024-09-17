import { Box, Button, Typography } from "@mui/material";

const ErrorPage = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="body1">😨对不起, 崩了</Typography>
      <Typography variant="body1">告诉我们发生了什么, 我们马上改进</Typography>
      <Button href="/">回到主页</Button>
    </Box>
  );
};

export default ErrorPage;
