# Restaurant Management System 

# A web based full stack application for Local Branch Networked Restaurants for managing online orders and internal services / reservations

#Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Technologies Used](#technologies-used)
  
---

##  Features

- User login (All Users including admin/staff/customers).
- User Regsitration (Customers)
- Branch Staff Resitration and Allocation (Admin)
- Reservations submit, edit, cancel
- Accept/Decline Reservations
- Add new branches ,Edit branch details , Activate/Deactivate branches
- Add products, edit products, remove products
- order products, add to cart, edit cart items, remove card items
- recieving email regarding reservations updates, order payement invoices based on payment method

## Installation
clone the repo or download the project as ZIP
- git clone https://github.com/PramodRavindu00/restaurantmanagementsystem.git (bash)

# Navigate to the project folder
cd restaurantmanagementsystem

## Environment Variables

Create a `.env` file in the root directory of the **backend** folder. Below are the environment variables you need to set:
- user - MySQL database server username
- password - database server password
- database - name of the newly created database (create a MySQL database it not created already)
- Email - app email
- Email_Password - app email's app password

# Install backend dependencies
cd backend
- run the main file untill project got synced and downloaded the dependencies

# Install frontend dependencies
cd ../frontend
- npm install

# Start backend server
- run the main file

# Start frontend server
cd ../frontend
- npm start

# Technologies Used
- Frontend: React + React Bootstrap
- Backend: SpringBoot
- Database: MySQL
- Others: JWT, dotenv, axios
