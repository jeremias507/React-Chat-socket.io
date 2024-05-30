import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  CardContent,
  Card,
  Icon,
  FormField,
  Container,
  Form,
  Input,
  MessageHeader,
  Message,
  Divider,
} from "semantic-ui-react";
import ScrollToBottom from "react-scroll-to-bottom";
const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState(" ");
  const [messagesList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (username && currentMessage) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");

      const info = {
        message: currentMessage,
        room,
        author: username,
        time: `${hours}:${minutes}`,
      };

      await socket.emit("send_message", info);
      setMessageList((list) => [...list, info]);
      setCurrentMessage("")
    }
  };

  useEffect(() => {
    const messageHandle = (data) => {
      setMessageList((list) => [...list, data]);
    };
    socket.on("receive_message", messageHandle);
    return () => socket.off("receive_message", messageHandle);
  }, [socket]);

  return (
    <Container>
      <Card fluid>
        <CardContent header={` Chat en vivo | Sala: ${room}`} />
        <ScrollToBottom>
          <CardContent style={{ height: "400px", padding:"8px"}}>
            {messagesList.map((item, i) => (
              <span key={i}>
                <Message
                  style={{
                    textAlign: username === item.author ? "right" : "left",
                  }}
                  success={username === item.author}
                  info={username !== item.author}
                >
                  <MessageHeader>{item.message}</MessageHeader>

                  <p>
                    Enviado por:<strong> {item.author}</strong>{" "}
                    <i>{item.time}</i>{" "}
                  </p>
                </Message>
                <Divider />
              </span>
            ))}
          </CardContent>
        </ScrollToBottom>
        <CardContent extra>
          <Form>
            <FormField>
              <Input
                action={{
                  color: "teal",
                  labelPosition: "right",
                  icon: "send",
                  content: "Enviar",
                  onClick: sendMessage,
                }}
                onChange={(e) => {
                  setCurrentMessage(e.target.value);
                }}
                type="text"
                placeholder="Mensaje..."
                value = {currentMessage}
              />
            </FormField>
          </Form>
          <Icon name="user" />4 Friends
        </CardContent>
      </Card>
    </Container>
  );
};

Chat.propTypes = {
  socket: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  room: PropTypes.string.isRequired,
};

export default Chat;
