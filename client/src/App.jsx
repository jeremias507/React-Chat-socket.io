import { useState } from "react";
import Chat from "./components/chat";
import "./App.css";
import io from "socket.io-client";
import {
  FormField,
  Button,
  Form,
  CardContent,
  Card,
  Icon,
  Container,
  Divider,
} from "semantic-ui-react";
import {} from "semantic-ui-react";

const socket = io.connect("http://localhost:3000");

function App() {
  const [username, setUsername] = useState(" ");
  const [room, setRoom] = useState(" ");
  const [showChat, setShowChat] = useState(false);


  const joinRoom = () => {
    if (username !== " " && room !== " ") {
      socket.emit("join_room", room);
      setShowChat(true)
    }
  };
  return (
    <>
      <Container>
      {!showChat?
          <Card fluid>
          <CardContent header="Unirme al chat " />
          <Divider />
          <CardContent>
            <Form>
              <FormField>
                <label>Nombre</label>
                <input
                  type="text"
                  placeholder="Ameth..."
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormField>
              <FormField>
                <label>ID sala</label>
                <input
                  type="text"
                  placeholder="ID sala"
                  onChange={(e) => setRoom(e.target.value)}
                />
              </FormField>
              <Button onClick={joinRoom} type="submit">
                Unirme
              </Button>
            </Form>
          </CardContent>

          <CardContent extra>
            <Icon name="user" />4 Friends
          </CardContent>
        </Card>
         :
        <Chat socket={socket} username={username} room={room}></Chat>
      }
      </Container>
    </>
  );
}

export default App;
