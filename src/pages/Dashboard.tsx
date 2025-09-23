import { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import { getHealth } from "../api/endpoints";

export default function Dashboard() {
  const [health, setHealth] = useState<any>(null);

  useEffect(() => { getHealth().then(setHealth); }, []);

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" gutterBottom>Health</Typography>
      <pre style={{ background: "#f6f8fa", padding: 16, borderRadius: 8 }}>
        {JSON.stringify(health, null, 2)}
      </pre>
    </Container>
  );
}