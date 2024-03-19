import React, { useEffect, useState } from "react";
import Input from "../../ReUsableComponents/Input/Input";
import axios from "../../Redux/Axios/axios";
import Room from "../../ReUsableComponents/Room/Room";
import CreateRoom from "../../ReUsableComponents/CreateRoom/CreateRoom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentMedical } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import ChatPanel from "../../ReUsableComponents/ChatPanel/ChatPanel";
import { useSelector } from "react-redux";

let socket = null;
const Messages = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.reducer.reducer);
  const [rooms, setRooms] = useState([]);
  const [notAcceptedRooms, setNotAcceptedRooms] = useState([]);
  const [room, setRoom] = useState(null);
  const [createRoom, setCreateRoom] = useState(false);
  const [sender, setSender] = useState(null);

  const createConnection = () => {
    socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/${
        user?.username ? user?.username : "group"
      }/${slug}/`
    );

    socket.onopen = function (e) {
      console.log("WebSocket connection opened");
      const message = {
        action_type: "connect",
        slug: slug,
      };
      socket.send(JSON.stringify(message));
    };

    socket.onclose = function (event) {
      console.log("WebSocket connection closed", event);
    };

    socket.onmessage = function (event) {
      try {
        let data = JSON.parse(event.data);
        console.log("datatatata", data);
        if (
          (data.action_type === "chat_message" ||
            data.action_type === "delete_message") &&
          data.new_room
        ) {
          setRoom(data.new_room);
        }
      } catch (error) {
        console.log("Error parsing message:", error);
      }
    };
  };

  const messageHandler = (message) => {
    if (!socket) {
      console.error("WebSocket connection is not initialized.");
      return;
    }
    const data = {
      username: user?.username,
      message: message,
      room_name: slug,
      action_type: "chat_message",
    };
    console.log("WebSocket.OPEN", WebSocket.OPEN);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.error("WebSocket connection is not open.");
    }
  };
  useEffect(() => {
    getRooms();
  }, []);

  useEffect(() => {
    if (slug) {
      createConnection();
      getRoom();
    }
    return () => (socket ? socket.close(1000, "Connection closed") : null);
  }, [slug]);
  const getRoom = () => {
    let endpoint = "http://127.0.0.1:8000/chat/get_room/";
    let data = {
      username: user?.username,
      slug: slug,
    };
    axios.post(endpoint, data).then((res) => {
      let responseData = res.data;
      if (responseData.room) {
        setRoom(responseData.room);
        setSender(responseData.user);
      }
    });
  };
  const getRooms = () => {
    let endpoint = "http://127.0.0.1:8000/chat/get_rooms/";
    let data = {
      username: user?.username,
    };
    axios.post(endpoint, data).then((res) => {
      let responseData = res.data;
      if (responseData.rooms) setRooms(responseData.rooms);
    });
  };
  const handleClose = () => {
    setCreateRoom(!createRoom);
  };

  const setCreatedRoom = (room) => {
    if (room) setRooms([...rooms, room]);
  };
  const openMessage = (room) => {
    navigate(`/messages/${room}`);
  };
  const deleteMessage = (message) => {
    if (!socket) {
      console.error("WebSocket connection is not initialized.");
      return;
    }
    const data = {
      username: user?.username,
      message_id: message?.id,
      room_name: slug,
      action_type: "delete_message",
    };
    console.log("WebSocket.OPEN", WebSocket.OPEN);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.error("WebSocket connection is not open.");
    }
  };
  return (
    <div className="grid grid-cols-2">
      <div className={"col-span-1 border-r border-gray-300  relative"}>
        <h1 className={"text-lg font-medium ml-4"}>Messages</h1>
        <button
          onClick={() => setCreateRoom(!createRoom)}
          className={"absolute top-0 right-4 p-2"}
        >
          <FontAwesomeIcon icon={faCommentMedical} />
        </button>
        <div className="flex justify-center">
          <Input className="w-[92%]" placeholder={"Search..."} />
        </div>

        {createRoom ? (
          <CreateRoom
            handleClose={handleClose}
            setRooms={setCreatedRoom}
            username={user?.username}
          />
        ) : null}
        <div>
          {rooms.map((room) => (
            <Room room={room} openMessage={openMessage} />
          ))}
        </div>
      </div>
      <div className={"col-span-1 relative"}>
        <ChatPanel
          sender={sender}
          room={room}
          messageHandler={messageHandler}
          deleteMessage={deleteMessage}
        />
      </div>
    </div>
  );
};

export default Messages;
