# README: VaxTrack App

## Overview
The **VaxTrack App** is a backend service for managing student vaccination records. It provides APIs to perform CRUD operations on student data, including bulk insertion of student records from a CSV file. The app is built using **Node.js**, **Express.js**, and **MongoDB**.

---

## Prerequisites
1. **Node.js**: Ensure you have Node.js installed (v14 or later).
2. **MongoDB**: A MongoDB database instance is required. You can use a local or cloud-based MongoDB instance (e.g., MongoDB Atlas).

**Installation**
1. Clone the repository
     ``` 
        git clone <repository-url>
        cd vaxtrack-app
        npm install
    ```
2. Create a `.env` file in the root directory with the following variables:
    ```
   DB_USER_NAME=<your-mongodb-username>
   DB_PASSWORD=<your-mongodb-password>
   DB_HOST_NAME=<your-mongodb-host>
   DB_NAME=<your-database-name>
   PORT=3001
    ```
3. Start the application

   ```
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```
## API Endpoints

| **Category**                     | **HTTP Method** | **Endpoint**                             | **Description**                                   |
|----------------------------------|------------------|-----------------------------------------|---------------------------------------------------|
| **Authentication**               | GET              | /login?code=<token>&user=<username>   | Verify user credentials                            |
| **Student Management**           | POST             | /students                               | Add a new student                                 |
|                                  | GET              | /students                               | Get all students                                  |
|                                  | GET              | /students?class=<class>                | Filter students by class                          |
|                                  | GET              | /students?name=<name>                  | Search students by name                           |
|                                  | GET              | /students/:id                           | Get student by ID                                 |
|                                  | PATCH            | /students/:id/vaccinate                | Update student vaccination status                 |
|                                  | POST             | /students/bulk                          | Bulk import students via CSV file                 |
| **Vaccination Drive Management** | POST             | /vaccinations                           | Create a new vaccination drive                    |
|                                  | GET              | /vaccinations                           | Get all vaccination drives                         |
|                                  | PATCH            | /vaccinations/:id                       | Update vaccination drive details                   |
| **Dashboard**                    | GET              | /dashboard/overview                     | Get vaccination statistics and upcoming drives     |
