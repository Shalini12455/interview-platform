import { Client, IMessage } from "@stomp/stompjs";

export interface CollaborationMessage {
  type: string;
  roomId: string;
  sender: string;
  content: string;
  language?: string;
  timestamp?: string;
}

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, any> = new Map();

  connect(onConnected: () => void, onError?: (error: any) => void) {
    this.client = new Client({
      webSocketFactory: () => {
        const wsUrl = process.env.REACT_APP_WS_URL || "ws://localhost:8080/ws";
        return new WebSocket(wsUrl);
      },
      onConnect: () => {
        console.log("WebSocket connected successfully!");
        onConnected();
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        if (onError) onError(frame);
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
      },
      onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
        if (onError) onError(error);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
    this.subscriptions.clear();
  }

  subscribeToRoom(
    roomId: string,
    callback: (message: CollaborationMessage) => void,
  ) {
    if (!this.client || !this.client.connected) {
      console.error("WebSocket not connected");
      return;
    }

    const subscription = this.client.subscribe(
      `/topic/room/${roomId}`,
      (message: IMessage) => {
        try {
          const data = JSON.parse(message.body);
          callback(data);
        } catch (error) {
          console.error("Failed to parse message:", error);
        }
      },
    );

    this.subscriptions.set(roomId, subscription);
  }

  unsubscribeFromRoom(roomId: string) {
    const subscription = this.subscriptions.get(roomId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(roomId);
    }
  }

  joinRoom(roomId: string, sender: string) {
    this.sendMessage("/app/collab/join", {
      roomId,
      sender,
      content: "",
      type: "JOIN",
    });
  }

  leaveRoom(roomId: string, sender: string) {
    this.sendMessage("/app/collab/leave", {
      roomId,
      sender,
      content: "",
      type: "LEAVE",
    });
  }

  sendCode(roomId: string, sender: string, content: string, language: string) {
    this.sendMessage("/app/collab/code", {
      roomId,
      sender,
      content,
      language,
      type: "CODE",
    });
  }

  sendChat(roomId: string, sender: string, content: string) {
    this.sendMessage("/app/collab/chat", {
      roomId,
      sender,
      content,
      type: "CHAT",
    });
  }

  changeLanguage(roomId: string, sender: string, language: string) {
    this.sendMessage("/app/collab/language", {
      roomId,
      sender,
      content: language,
      language,
      type: "LANGUAGE",
    });
  }

  private sendMessage(
    destination: string,
    body: Partial<CollaborationMessage>,
  ) {
    if (!this.client || !this.client.connected) {
      console.error("WebSocket not connected");
      return;
    }
    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }

  isConnected(): boolean {
    return this.client?.connected ?? false;
  }
}

export const wsService = new WebSocketService();
export default wsService;
