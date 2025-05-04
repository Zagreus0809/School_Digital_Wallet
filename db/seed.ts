import { db } from "./index";
import * as schema from "@shared/schema";
import { storage } from "../server/storage";

async function seed() {
  try {
    console.log("Starting database seed...");
    
    // Check if users already exist
    const existingUsers = await db.query.users.findMany();
    if (existingUsers.length > 0) {
      console.log("Database already has users, skipping seed");
      return;
    }
    
    // Create test users
    const users = [
      {
        username: "jessica",
        password: "password123",
        email: "jessica.smith@school.edu",
        fullName: "Jessica Smith",
        walletId: "wallet-jsmith-2023",
        phone: "(555) 123-4567",
        studentId: "S12345678"
      },
      {
        username: "mike",
        password: "password123",
        email: "mike.johnson@school.edu",
        fullName: "Mike Johnson",
        walletId: "wallet-mjohnson-2023",
        phone: "(555) 987-6543",
        studentId: "S87654321"
      },
      {
        username: "alex",
        password: "password123",
        email: "alex.brown@school.edu",
        fullName: "Alex Brown",
        walletId: "wallet-abrown-2023",
        phone: "(555) 456-7890",
        studentId: "S45678901"
      },
      {
        username: "cafeteria",
        password: "password123",
        email: "cafeteria@school.edu",
        fullName: "School Cafeteria",
        walletId: "wallet-cafeteria-2023",
      },
      {
        username: "bookstore",
        password: "password123",
        email: "bookstore@school.edu",
        fullName: "Book Store",
        walletId: "wallet-bookstore-2023",
      }
    ];
    
    // Create users and wallets
    for (const userData of users) {
      console.log(`Creating user: ${userData.username}`);
      const user = await storage.createUser(userData);
      
      // Add initial balance for test users
      if (userData.username === "jessica") {
        console.log(`Adding initial balance for ${userData.username}`);
        await storage.updateWalletBalance(user.id, "245.50");
      } else if (userData.username === "mike") {
        await storage.updateWalletBalance(user.id, "100.00");
      } else if (userData.username === "alex") {
        await storage.updateWalletBalance(user.id, "150.00");
      }
    }
    
    // Get users for transactions
    const jessica = await storage.getUserByUsername("jessica");
    const mike = await storage.getUserByUsername("mike");
    const alex = await storage.getUserByUsername("alex");
    const cafeteria = await storage.getUserByUsername("cafeteria");
    const bookstore = await storage.getUserByUsername("bookstore");
    
    if (jessica && mike && alex && cafeteria && bookstore) {
      // Create sample transactions
      const transactions = [
        {
          senderId: alex.id,
          receiverId: jessica.id,
          amount: "25.00",
          note: "Lunch money",
          createdAt: new Date(2023, 9, 6, 14, 34)
        },
        {
          senderId: jessica.id,
          receiverId: cafeteria.id,
          amount: "8.50",
          note: "Daily lunch",
          createdAt: new Date(2023, 9, 5, 12, 15)
        },
        {
          senderId: jessica.id,
          receiverId: bookstore.id,
          amount: "32.99",
          note: "Science textbook",
          createdAt: new Date(2023, 9, 5, 9, 45)
        }
      ];
      
      for (const txData of transactions) {
        console.log(`Creating transaction: ${txData.senderId} -> ${txData.receiverId}`);
        const transactionId = `TRX${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        
        await db.insert(schema.transactions).values({
          ...txData,
          transactionId,
          status: "completed"
        });
      }
    }
    
    console.log("Database seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
