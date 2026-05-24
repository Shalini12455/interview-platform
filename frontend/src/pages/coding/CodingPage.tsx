import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CodingPage: React.FC = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [newRoomId, setNewRoomId] = useState("");

  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setNewRoomId(id);
  };

  const createRoom = () => {
    if (!newRoomId) {
      generateRoomId();
      return;
    }
    navigate(`/coding/room/${newRoomId}`);
  };

  const joinRoom = () => {
    if (!roomId.trim()) {
      toast.error("Please enter a room ID");
      return;
    }
    navigate(`/coding/room/${roomId.trim().toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <nav className="bg-dark-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-500">
            Interview Platform
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-slate-400 hover:text-white transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">💻</div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Collaborative Coding
          </h2>
          <p className="text-slate-400">
            Code together in real-time with live sync, chat, and multiple
            language support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Create Room */}
          <div
            className="bg-dark-800 rounded-2xl p-8
                          border border-slate-700"
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              🚀 Create a Room
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Start a new session and share the room ID with your partner
            </p>

            {newRoomId && (
              <div
                className="mb-4 p-4 bg-dark-900 rounded-xl
                              border border-primary-500/30"
              >
                <p className="text-slate-400 text-xs mb-1">
                  Your Room ID — Share this!
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-2xl font-mono font-bold
                                   text-primary-400 tracking-widest"
                  >
                    {newRoomId}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(newRoomId);
                      toast.success("Room ID copied!");
                    }}
                    className="text-xs text-slate-400
                               hover:text-white transition"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={generateRoomId}
              className="w-full py-3 mb-3 bg-slate-700
                         hover:bg-slate-600 rounded-xl
                         text-sm font-medium transition"
            >
              🎲 Generate Room ID
            </button>

            <button
              onClick={createRoom}
              disabled={!newRoomId}
              className="w-full py-3 bg-primary-600
                         hover:bg-primary-700 rounded-xl
                         font-semibold transition
                         disabled:opacity-50
                         disabled:cursor-not-allowed"
            >
              Enter Room
            </button>
          </div>

          {/* Join Room */}
          <div
            className="bg-dark-800 rounded-2xl p-8
                          border border-slate-700"
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              🔗 Join a Room
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Enter a room ID shared by your partner to join their session
            </p>

            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="Enter Room ID (e.g. ABC123)"
              maxLength={6}
              className="w-full px-4 py-3 bg-dark-900 border
                         border-slate-600 rounded-xl text-white
                         placeholder-slate-500 font-mono
                         text-center text-lg tracking-widest
                         focus:outline-none focus:border-primary-500
                         transition mb-4"
            />

            <button
              onClick={joinRoom}
              className="w-full py-3 bg-green-600
                         hover:bg-green-700 rounded-xl
                         font-semibold transition"
            >
              Join Room
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "⚡",
              title: "Real-time Sync",
              desc: "Code changes sync instantly for all participants",
            },
            {
              icon: "💬",
              title: "Live Chat",
              desc: "Communicate with your partner while coding",
            },
            {
              icon: "🌐",
              title: "Multi-language",
              desc: "JavaScript, Python, Java, TypeScript and more",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-dark-800 rounded-xl p-6
                         border border-slate-700 text-center"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
        {/* DSA Practice Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/coding/practice")}
            className="px-8 py-4 bg-green-600 hover:bg-green-700
               text-white font-bold rounded-xl transition text-lg"
          >
            🧠 Start DSA Practice
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodingPage;
