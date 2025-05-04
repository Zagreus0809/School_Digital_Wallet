import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer, WebSocket } from "ws";
import express from "express";
import session from "express-session";
import { z } from "zod";
import { loginSchema, insertUserSchema, insertTransactionSchema } from "@shared/schema";
import { randomUUID } from "crypto";

// Store active websocket connections by user ID
const clients = new Map<number, WebSocket>();

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "school-digital-wallet-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
    })
  );

  // Authentication middleware
  const authenticate = (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // API routes
  const apiPrefix = "/api";

  // Authentication routes
  app.post(`${apiPrefix}/auth/register`, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if walletId already exists
      const existingWallet = await storage.getUserByWalletId(userData.walletId);
      if (existingWallet) {
        return res.status(400).json({ message: "Wallet ID already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;
      
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error("Error registering user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiPrefix}/auth/login`, async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(credentials.username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isPasswordValid = await storage.verifyPassword(user.password, credentials.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user ID in session
      req.session.userId = user.id;
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error("Error logging in:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${apiPrefix}/auth/logout`, authenticate, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get(`${apiPrefix}/auth/me`, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching current user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // User routes
  app.get(`${apiPrefix}/users/:id`, authenticate, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiPrefix}/users/wallet/:walletId`, authenticate, async (req, res) => {
    try {
      const { walletId } = req.params;
      
      const user = await storage.getUserByWalletId(walletId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user by wallet ID:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Wallet routes
  app.get(`${apiPrefix}/wallet`, authenticate, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      
      const wallet = await storage.getWalletByUserId(userId);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      
      return res.status(200).json(wallet);
    } catch (error) {
      console.error("Error fetching wallet:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Transaction routes
  app.post(`${apiPrefix}/transactions`, authenticate, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const { receiverWalletId, amount, note } = req.body;
      
      // Get sender
      const sender = await storage.getUserById(userId);
      if (!sender) {
        return res.status(404).json({ message: "Sender not found" });
      }
      
      // Get receiver
      const receiver = await storage.getUserByWalletId(receiverWalletId);
      if (!receiver) {
        return res.status(404).json({ message: "Receiver not found" });
      }
      
      // Process transaction
      const transaction = await storage.processTransaction(
        sender.walletId,
        receiverWalletId,
        amount,
        note
      );
      
      if (!transaction) {
        return res.status(400).json({ message: "Transaction failed" });
      }
      
      // Prepare transaction details for response and websocket notification
      const transactionDetails = {
        ...transaction,
        senderName: sender.fullName,
        receiverName: receiver.fullName,
      };
      
      // Notify both sender and receiver via WebSocket
      [sender.id, receiver.id].forEach(id => {
        const client = clients.get(id);
        if (client && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'transaction',
            data: transactionDetails
          }));
        }
      });
      
      return res.status(201).json(transactionDetails);
    } catch (error) {
      console.error("Error creating transaction:", error);
      const message = error instanceof Error ? error.message : "Internal server error";
      return res.status(400).json({ message });
    }
  });

  app.get(`${apiPrefix}/transactions`, authenticate, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      
      const transactions = await storage.getTransactionsByUserId(userId);
      
      return res.status(200).json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(`${apiPrefix}/transactions/recent`, authenticate, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      
      const transactions = await storage.getRecentTransactionsByUserId(userId, limit);
      
      return res.status(200).json(transactions);
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  // WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    let userId: number | null = null;
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle authentication message
        if (data.type === 'auth' && data.userId) {
          userId = data.userId;
          clients.set(userId, ws);
          console.log(`WebSocket client authenticated: ${userId}`);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      if (userId) {
        clients.delete(userId);
        console.log(`WebSocket client disconnected: ${userId}`);
      }
    });
  });

  return httpServer;
}
