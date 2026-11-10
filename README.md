# CampusFind
CampusFind – Campus Lost & Found Management System

CampusFind is a full-stack web application designed to help students and staff report, search, and recover lost belongings within a college campus.

The platform provides a centralized place to report lost or found items, view reported items, search listings, and update recovery status.

Problem Statement

Students frequently lose personal belongings such as ID cards, wallets, mobile phones, keys, and electronic devices on campus. Finding these items can be difficult because there is no centralized system for reporting and tracking them.

CampusFind addresses this problem by providing a simple, responsive, and accessible online lost-and-found management platform.

Objectives

* Provide a centralized platform for lost-and-found reports.
* Allow users to report lost and found items.
* Display reported items in an organized manner.
* Enable users to search and filter item listings.
* Allow item status updates when belongings are recovered.
* Perform CRUD operations using MongoDB.
* Provide a responsive user interface.

Technologies Used

Frontend

* HTML5
* CSS3
* JavaScript
* React.js
* Vite

Backend

* Node.js
* Express.js
* RESTful APIs

Database

* MongoDB Atlas
* Mongoose

Development and Deployment

* Git and GitHub
* Vercel
* Visual Studio Code
* npm

Features

1. Report Lost Items

Users can submit details about belongings they have lost on campus.

2. Report Found Items

Users can report items they have found so that their owners can identify and recover them.

3. View Reported Items

The application displays lost and found reports retrieved from MongoDB.

4. Search and Filter

Users can search for items and filter listings based on their type or status.

5. Update Item Status

Users can update an item’s status when it has been recovered.

6. Delete Reports

Users can remove item reports when they are no longer required.

7. Responsive Design

The application is designed to work across desktop, tablet, and mobile screen sizes.

Project Structure
~~~
CampusFind/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── ReportForm.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── models/
│   │   └── Item.js
│   ├── routes/
│   │   └── itemRoutes.js
│   ├── app.js
│   ├── index.js
│   ├── server.js
│   ├── vercel.json
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
~~~

Installation and Setup

Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git
* MongoDB Atlas account

1. Clone the Repository

git clone https://github.com/karthikrdy7/CampusFind.git

2. Navigate to the Project

cd CampusFind

3. Install Backend Dependencies

cd server
npm install

4. Configure Backend Environment Variables

Create a .env file inside the server directory.

PORT=5001
MONGO_URI=your_mongodb_connection_string

Replace the MongoDB connection string with your own MongoDB Atlas connection string.

5. Start the Backend

npm run dev

The backend will run at:

http://localhost:5001

6. Install Frontend Dependencies

Open another terminal:

cd client
npm install

7. Configure Frontend Environment Variables

Create a .env file inside the client directory.

VITE_API_URL=http://localhost:5001

8. Start the Frontend

npm run dev

The frontend will run at:

http://localhost:5173

REST API Endpoints

Base URL:

http://localhost:5001/api/items

Method	Endpoint	Description
GET	/api/items	Retrieve all items
GET	/api/items/:id	Retrieve an item by ID
POST	/api/items	Create a new item
PUT	/api/items/:id	Update an item
DELETE	/api/items/:id	Delete an item

MongoDB Database

CampusFind uses MongoDB Atlas to store item information.

Each item contains fields such as:

* Item name
* Type (Lost or Found)
* Category
* Description
* Location
* Date
* Color
* Contact information
* Image
* Status (Active or Recovered)

Mongoose is used to define the item schema and interact with the MongoDB database.

CRUD Operations

The application demonstrates all four major database operations:

* Create: Add new lost or found item reports.
* Read: Retrieve and display item reports.
* Update: Change the status of an item.
* Delete: Remove an item report.

Deployment

The application is intended to be deployed using Vercel.

The frontend and backend can be deployed as separate Vercel projects using the same GitHub repository.

Frontend Deployment

* Root Directory: client
* Framework Preset: Vite
* Environment Variable: VITE_API_URL

Backend Deployment

* Root Directory: server
* Framework Preset: Other
* Environment Variable: MONGO_URI

After deployment, configure the frontend API URL to point to the deployed backend.

Project Links

* GitHub Repository: https://github.com/karthikrdy7/CampusFind
* Live Application: Add your frontend Vercel URL here.
* Backend API: Add your backend Vercel URL here.

Future Enhancements

* User authentication and authorization.
* Image upload functionality.
* Email notifications for matching lost and found items.
* Admin dashboard.
* Advanced search and filtering.
* Item ownership verification.

Author

Karthik Reddy

B.Tech – Computer Science and Engineering

License

This project was developed for educational purposes as part of a full-stack web application assignment.
