===============================================================================
STORE & USER MANAGEMENT PLATFORM
Setup Guide, App Instructions & Login Credentials
===============================================================================

1. PROJECT OVERVIEW
-------------------------------------------------------------------------------
The application is a full-stack Store & Rating Management System built with:
  - Frontend: React (Vite), JavaScript, Human-Designed Modern CSS Design System
  - Backend: Node.js, Express, MySQL, JWT Authentication, bcryptjs
  - Database: MySQL database named "assessment"
  - Features: Multi-role system (ADMIN, OWNER, USER), store searching & filtering,
    star rating submission, user directories, password policies & dashboard metrics.


2. HOW TO SET UP & RUN THE APPLICATION
-------------------------------------------------------------------------------
Prerequisites:
  - Node.js (v18 or higher recommended)
  - MySQL Server (running on 127.0.0.1:3307 or 3306)

Step A: Database & Backend Configuration
  1. Navigate to the backend directory:
     cd backend

  2. Install dependencies:
     npm install

  3. Environment variables in backend/.env:
     PORT=5000
     DB_HOST=127.0.0.1
     DB_PORT=3307
     DB_USER=root
     DB_PASSWORD=
     DB_NAME=assessment
     JWT_SECRET=store_portal_jwt_secret_key_assessment_2026

  4. Initialize Database Schema & Seed Data:
     npm run init-db
     npm run seed
     node src/utils/seedStores.js

  5. Start Backend Server:
     npm run dev  (or: npm start)
     -> Server runs at: http://localhost:5000

Step B: Frontend Setup
  1. Navigate to the frontend directory:
     cd frontend

  2. Install dependencies:
     npm install

  3. Start Frontend Development Server:
     npm run dev
     -> App runs at: http://localhost:5173


3. LOGIN CREDENTIALS BY ROLE
-------------------------------------------------------------------------------

[SYSTEM ADMINISTRATOR (ADMIN)]
  - Email:    admin@storeportal.com
  - Password: Admin@1234
  - Capabilities:
      Manage Users (Filter, Search, Sort & Add System Admins, Owners, Users)
      Manage Stores (Filter, Search, Sort & Add Stores)
      View System-wide Dashboard Metrics (Total Users, Total Stores, Total Ratings)

[STORE OWNERS (OWNER)]
  1. TechWorld Electronics Owner
     - Email:    rajesh@techworld.com
     - Password: Rajesh@123
     - Store:    TechWorld Electronics

  2. Fashion Hub Owner
     - Email:    priya@fashionhub.com
     - Password: Priya@1234
     - Store:    Fashion Hub

  3. FreshMart Groceries Owner
     - Email:    amit@freshmart.com
     - Password: Amit@12345
     - Store:    FreshMart Groceries

  4. Book Paradise Owner
     - Email:    sneha@bookparadise.com
     - Password: Sneha@1234
     - Store:    Book Paradise

  5. Sports Zone Arena Owner
     - Email:    irfan@sportszone.com
     - Password: Irfan@1234
     - Store:    Sports Zone Arena

  - Capabilities:
      View Owner Dashboard with store average rating & total reviews
      Real-time rating distribution breakdown (5★ to 1★)
      Inspect customer rating submissions and search/sort feedback
      Modify account password & manage profile

[NORMAL USERS (USER)]
  1. Vikram Singh
     - Email:    vikram@gmail.com
     - Password: Vikram@123

  2. Ananya Mishra
     - Email:    ananya@gmail.com
     - Password: Ananya@123

  - Capabilities:
      View list of available stores and search by name or address/city
      Submit and update 1 to 5 star ratings per store
      Modify account password & view profile


4. SYSTEM VALIDATION RULES & POLICIES
-------------------------------------------------------------------------------
  - Full Name Length: 20 to 60 characters
  - Password Criteria: 8 to 16 characters, must contain at least 1 uppercase
    letter (A-Z) and 1 special character (!@#$%^&*...)
  - Address Limit: Maximum 400 characters, required
  - Email: Must be valid email address format and unique per user/store
===============================================================================
