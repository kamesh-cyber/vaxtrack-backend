# README: VaxTrack App

## Overview
The **VaxTrack App** is a backend service for managing student vaccination records. It provides APIs to perform CRUD operations on student data, including bulk insertion of student records from a CSV file. The app is built using **Node.js**, **Express.js**, and **MongoDB**.

---

## Prerequisites
1. **Node.js**: Ensure you have Node.js installed (v14 or later).
2. **MongoDB**: A MongoDB database instance is required. You can use a local or cloud-based MongoDB instance (e.g., MongoDB Atlas).
3. **Environment Variables**: Create a `.env` file in the root directory with the following variables:
   ```env
   DB_USER_NAME=<your-mongodb-username>
   DB_PASSWORD=<your-mongodb-password>
   DB_HOST_NAME=<your-mongodb-host>
   DB_NAME=<your-database-name>
   PORT=3001