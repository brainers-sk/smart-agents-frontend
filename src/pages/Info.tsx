import { useEffect, useState } from "react";
import { Container, Typography, Grid, Paper } from "@mui/material";
import { getHealth } from "../api/endpoints";

type Health = {
  live: boolean;
  database: boolean;
  migrationVersion?: string | null;
  appVersion: string;
};

export default function Info() {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    getHealth().then(setHealth);
  }, []);

  if (!health) return null;

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" gutterBottom>
        System Info
      </Typography>

      <Grid container spacing={2}>
        <Grid>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="subtitle2">App Live</Typography>
            <Typography
              variant="h6"
              color={health.live ? "success.main" : "error.main"}
            >
              {health.live ? "Yes ✅" : "No ❌"}
            </Typography>
          </Paper>
        </Grid>

        <Grid>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="subtitle2">Database</Typography>
            <Typography
              variant="h6"
              color={health.database ? "success.main" : "error.main"}
            >
              {health.database ? "Connected ✅" : "Down ❌"}
            </Typography>
          </Paper>
        </Grid>

        <Grid>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="subtitle2">Migration Version</Typography>
            <Typography variant="h6">
              {health.migrationVersion || "—"}
            </Typography>
          </Paper>
        </Grid>

        <Grid>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="subtitle2">App Version</Typography>
            <Typography variant="h6">{health.appVersion}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}