import React, { useEffect, useState } from "react";
import "./App.css";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { IPlayer } from "./domain/player";

function App() {
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [open, setOpen] = useState(false);
  const [player, setPlayer] = useState<IPlayer>({ name: "" });

  const getPlayers = async () => {
    const response = await fetch(
      "https://gameikvall.logotype.workers.dev/players"
    );
    const data = await response.json();
    setPlayers(data);
  };
  const addPlayer = async (player: IPlayer) => {
    const response = await fetch(
      "https://gameikvall.logotype.workers.dev/addPlayer",
      {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(player),
      }
    );
    const data = await response.json();
    setPlayers(data);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getPlayers();
  }, []);

  return (
    <div className="App">
      <Card sx={{ width: 360 }}>
        <CardContent>
          <Typography component="div" variant="h4">
            Game ikväll?
          </Typography>
          <List
            sx={{ width: "50%", maxWidth: 180, bgcolor: "background.paper" }}
          >
            {players.map((player) => (
              <ListItem>
                <ListItemAvatar>
                  <Avatar></Avatar>
                </ListItemAvatar>
                <ListItemText primary={player.name} />
              </ListItem>
            ))}
          </List>
          <Button variant="contained" onClick={handleClickOpen}>
            Game ikväll
          </Button>
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Namn"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setPlayer({ ...player, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Avbryt</Button>
          <Button
            onClick={() => {
              addPlayer(player);
              getPlayers();
              handleClose();
            }}
          >
            Jag är på
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
