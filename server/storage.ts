import { db } from "@db";
import { users, wallets, transactions } from "@shared/schema";
import { InsertUser, User, Wallet, Transaction, TransactionWithUsers } from "@shared/schema";
import { eq, and, desc, asc, or } from "drizzle-orm";
import * as crypto from "crypto";
import * as bcrypt from "crypto";

// User-related functions
export const storage = {
  // User functions
  async createUser(data: InsertUser): Promise<User> {
    // Hash the password
    const hashedPassword = await this.hashPassword(data.password);
    
    // Create the user
    const [newUser] = await db.insert(users).values({
      ...data,
      password: hashedPassword,
    }).returning();
    
    // Create wallet for the user
    await this.createWallet(newUser.id);
    
    return newUser;
  },
  
  async getUserById(id: number): Promise<User | null> {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    
    return result || null;
  },
  
  async getUserByUsername(username: string): Promise<User | null> {
    const result = await db.query.users.findFirst({
      where: eq(users.username, username),
    });
    
    return result || null;
  },
  
  async getUserByWalletId(walletId: string): Promise<User | null> {
    const result = await db.query.users.findFirst({
      where: eq(users.walletId, walletId),
    });
    
    return result || null;
  },
  
  // Wallet functions
  async createWallet(userId: number): Promise<Wallet> {
    const [newWallet] = await db.insert(wallets).values({
      userId,
      balance: "0",
    }).returning();
    
    return newWallet;
  },
  
  async getWalletByUserId(userId: number): Promise<Wallet | null> {
    const result = await db.query.wallets.findFirst({
      where: eq(wallets.userId, userId),
    });
    
    return result || null;
  },
  
  async updateWalletBalance(userId: number, newBalance: string): Promise<Wallet | null> {
    const [updatedWallet] = await db
      .update(wallets)
      .set({ 
        balance: newBalance,
        updatedAt: new Date() 
      })
      .where(eq(wallets.userId, userId))
      .returning();
    
    return updatedWallet || null;
  },
  
  // Transaction functions
  async createTransaction(
    senderId: number,
    receiverId: number,
    amount: string,
    note?: string
  ): Promise<Transaction> {
    // Generate a transaction ID
    const transactionId = `TRX${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    // Create the transaction
    const [newTransaction] = await db.insert(transactions).values({
      senderId,
      receiverId,
      amount,
      note,
      transactionId,
    }).returning();
    
    return newTransaction;
  },
  
  async getTransactionById(id: number): Promise<Transaction | null> {
    const result = await db.query.transactions.findFirst({
      where: eq(transactions.id, id),
    });
    
    return result || null;
  },
  
  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    const result = await db.query.transactions.findMany({
      where: or(
        eq(transactions.senderId, userId),
        eq(transactions.receiverId, userId)
      ),
      orderBy: [desc(transactions.createdAt)],
    });
    
    return result || [];
  },
  
  async getRecentTransactionsByUserId(userId: number, limit: number = 5): Promise<Transaction[]> {
    const result = await db.query.transactions.findMany({
      where: or(
        eq(transactions.senderId, userId),
        eq(transactions.receiverId, userId)
      ),
      orderBy: [desc(transactions.createdAt)],
      limit,
    });
    
    return result || [];
  },
  
  // Authentication helpers
  async hashPassword(password: string): Promise<string> {
    // In a real app, use a proper password hashing library like bcrypt
    // This is a simplified example using Node's crypto module
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  },
  
  async verifyPassword(storedPassword: string, suppliedPassword: string): Promise<boolean> {
    const [salt, storedHash] = storedPassword.split(':');
    const hash = crypto.pbkdf2Sync(suppliedPassword, salt, 1000, 64, 'sha512').toString('hex');
    return storedHash === hash;
  },
  
  // Transaction helpers
  async processTransaction(
    senderWalletId: string,
    receiverWalletId: string,
    amount: string,
    note?: string
  ): Promise<Transaction | null> {
    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      throw new Error("Invalid amount");
    }
    
    // Get sender and receiver
    const sender = await this.getUserByWalletId(senderWalletId);
    const receiver = await this.getUserByWalletId(receiverWalletId);
    
    if (!sender || !receiver) {
      throw new Error("Invalid sender or receiver");
    }
    
    // Get sender's wallet
    const senderWallet = await this.getWalletByUserId(sender.id);
    if (!senderWallet) {
      throw new Error("Sender wallet not found");
    }
    
    // Check if sender has enough balance
    const senderBalance = parseFloat(senderWallet.balance);
    if (senderBalance < amountNum) {
      throw new Error("Insufficient balance");
    }
    
    // Get receiver's wallet
    const receiverWallet = await this.getWalletByUserId(receiver.id);
    if (!receiverWallet) {
      throw new Error("Receiver wallet not found");
    }
    
    // Update balances
    const newSenderBalance = (senderBalance - amountNum).toFixed(2);
    const newReceiverBalance = (parseFloat(receiverWallet.balance) + amountNum).toFixed(2);
    
    // Update wallets
    await this.updateWalletBalance(sender.id, newSenderBalance);
    await this.updateWalletBalance(receiver.id, newReceiverBalance);
    
    // Create transaction record
    const transaction = await this.createTransaction(sender.id, receiver.id, amount, note);
    
    return transaction;
  }
};
