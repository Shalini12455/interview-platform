import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import wsService, {
  CollaborationMessage,
} from "../../services/websocketService";

const CollaborationRoom: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();

  const [isConnected, setIsConnected] = useState(false);
  const [code, setCode] = useState("// Start coding here...\n");
  const [language, setLanguage] = useState("javascript");
  const [chatMessages, setChatMessages] = useState<CollaborationMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [isRemoteUpdate, setIsRemoteUpdate] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const senderName = user?.firstName + " " + user?.lastName;

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "typescript", label: "TypeScript" },
    { value: "cpp", label: "C++" },
  ];

  useEffect(() => {
    if (!roomId) return;

    wsService.connect(
      () => {
        setIsConnected(true);
        toast.success("Connected to room!");

        wsService.subscribeToRoom(roomId, handleMessage);
        wsService.joinRoom(roomId, senderName);
      },
      () => {
        setIsConnected(false);
        toast.error("Connection failed");
      },
    );

    return () => {
      wsService.leaveRoom(roomId, senderName);
      wsService.unsubscribeFromRoom(roomId);
      wsService.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleMessage = (message: CollaborationMessage) => {
    switch (message.type) {
      case "CODE_UPDATE":
        if (message.sender !== senderName) {
          setIsRemoteUpdate(true);
          setCode(message.content);
          setTimeout(() => setIsRemoteUpdate(false), 100);
        }
        break;

      case "CHAT_MESSAGE":
        setChatMessages((prev) => [...prev, message]);
        break;

      case "USER_JOINED":
        setChatMessages((prev) => [...prev, message]);
        setParticipants((prev) =>
          prev.includes(message.sender) ? prev : [...prev, message.sender],
        );
        break;

      case "USER_LEFT":
        setChatMessages((prev) => [...prev, message]);
        setParticipants((prev) => prev.filter((p) => p !== message.sender));
        break;

      case "LANGUAGE_CHANGE":
        if (message.sender !== senderName) {
          setLanguage(message.language || "javascript");
          toast(`${message.sender} changed language to ${message.language}`);
        }
        break;
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    if (isRemoteUpdate) return;
    const newCode = value || "";
    setCode(newCode);
    if (roomId && isConnected) {
      wsService.sendCode(roomId, senderName, newCode, language);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (roomId && isConnected) {
      wsService.changeLanguage(roomId, senderName, newLanguage);
    }
  };

  const handleSendChat = () => {
    if (!chatInput.trim() || !roomId) return;
    wsService.sendChat(roomId, senderName, chatInput);
    setChatInput("");
  };

  const handleLeave = () => {
    if (roomId) {
      wsService.leaveRoom(roomId, senderName);
    }
    wsService.disconnect();
    navigate("/coding");
  };

  return (
    <div className="h-screen bg-dark-900 text-white flex flex-col">
      {/* Header */}
      <nav
        className="bg-dark-800 border-b border-slate-700
                      px-6 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-primary-500">Collaboration Room</h1>
          <span
            className="px-3 py-1 bg-slate-700 rounded-full
                           text-sm font-mono text-slate-300"
          >
            Room: {roomId}
          </span>
          <span
            className={`flex items-center gap-1.5 text-sm
                           ${isConnected ? "text-green-400" : "text-red-400"}`}
          >
            <span
              className={`w-2 h-2 rounded-full
                             ${isConnected ? "bg-green-400" : "bg-red-400"}`}
            />
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-1.5 bg-dark-900 border border-slate-600
                       rounded-lg text-sm text-white
                       focus:outline-none focus:border-primary-500"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleLeave}
            className="px-4 py-2 bg-red-600 hover:bg-red-700
                       rounded-lg text-sm font-medium transition"
          >
            Leave Room
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div
            className="flex items-center justify-between
                          px-4 py-2 bg-dark-800 border-b
                          border-slate-700"
          >
            <span className="text-sm text-slate-400">
              Code Editor — Changes sync in real-time
            </span>
            <div className="flex items-center gap-2">
              {participants.map((p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 bg-primary-500/20
                             text-primary-400 rounded text-xs"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>
        </div>

        {/* Chat Panel */}
        <div
          className="w-80 flex flex-col bg-dark-800
                        border-l border-slate-700"
        >
          {/* Participants */}
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">
              👥 Participants ({participants.length})
            </h3>
            {participants.length === 0 ? (
              <p className="text-slate-500 text-xs">No one else in the room</p>
            ) : (
              participants.map((p) => (
                <div
                  key={p}
                  className="flex items-center gap-2 text-sm
                             text-slate-300 mb-1"
                >
                  <span
                    className="w-2 h-2 bg-green-400
                                   rounded-full"
                  />
                  {p}
                </div>
              ))
            )}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 ? (
              <p className="text-slate-500 text-xs text-center mt-4">
                No messages yet. Say hello!
              </p>
            ) : (
              chatMessages.map((msg, i) => (
                <div key={i}>
                  {msg.type === "CHAT_MESSAGE" ? (
                    <div
                      className={`${
                        msg.sender === senderName ? "text-right" : "text-left"
                      }`}
                    >
                      <p className="text-xs text-slate-500 mb-1">
                        {msg.sender}
                      </p>
                      <span
                        className={`inline-block px-3 py-2
                                       rounded-lg text-sm max-w-full
                                       break-words
                        ${
                          msg.sender === senderName
                            ? "bg-primary-600 text-white"
                            : "bg-slate-700 text-slate-200"
                        }`}
                      >
                        {msg.content}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span
                        className="text-xs text-slate-500
                                       italic"
                      >
                        {msg.content}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSendChat();
                }}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-dark-900 border
                           border-slate-600 rounded-lg text-sm
                           text-white placeholder-slate-500
                           focus:outline-none focus:border-primary-500"
              />
              <button
                onClick={handleSendChat}
                disabled={!chatInput.trim()}
                className="px-3 py-2 bg-primary-600
                           hover:bg-primary-700 rounded-lg
                           text-sm transition
                           disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationRoom;
