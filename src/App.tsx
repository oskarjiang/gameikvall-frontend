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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { IPlayer } from "./domain/player";

function App() {
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [open, setOpen] = useState(false);
  const [player, setPlayer] = useState<IPlayer | null>(null);
  const [remember, setRemember] = useState<boolean>(false);

  const getPlayers = async () => {
    const response = await fetch(
      "https://gameikvall.logotype.workers.dev/players"
    );
    const data = await response.json();
    setPlayers(data);
  };
  const addPlayer = async (player: IPlayer) => {
    await fetch("https://gameikvall.logotype.workers.dev/addPlayer", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(player),
    });
    if (!players.find((x) => x.name === player.name)) {
      setPlayers([...players, player]);
    }
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

  useEffect(() => {
    const cookies = document.cookie.split(";").map((x) => {
      const cookie = x.split("=");
      return {
        key: cookie[0].trim(),
        value: cookie[1].trim(),
      };
    });
    const playerCookie = cookies.find((x) => x.key === "player");
    if (playerCookie) {
      const _player: IPlayer = JSON.parse(playerCookie.value);
      const newPlayer: IPlayer = { ...player, name: _player.name };
      setPlayer(newPlayer);
    }
  }, []);

  return (
    <div className="App">
      <Card sx={{ width: 360 }}>
        <CardContent>
          <Typography component="div" variant="h4">
            {players.length >= 5 ? "Game ikväll!" : "Game ikväll?"}
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
          <Button
            variant="contained"
            onClick={() => {
              if (player) {
                addPlayer(player);
              } else {
                handleClickOpen();
              }
            }}
          >
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
          <FormControlLabel
            label="Kom ihåg mig"
            control={
              <Checkbox checked={remember} onChange={() => setRemember(true)} />
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Avbryt</Button>
          <Button
            onClick={() => {
              if (player) addPlayer(player!);
              getPlayers();
              if (remember) {
                document.cookie = `player=${JSON.stringify(player)}`;
              }
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
