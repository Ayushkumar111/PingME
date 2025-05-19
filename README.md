💬 Ping ME
A full-stack real-time chat application built with React, Node.js, Express, MongoDB, Socket.IO, and Cloudinary for image uploads.
Supports 🧑‍💻 user authentication, 📸 image messaging, ⚡ real-time updates, 🎨 theme switching, and more!

✨ Features
🔐 User Authentication (Sign Up, Login, Logout)

⚡ Real-time Messaging with Socket.IO

💬 Send Text and Image messages

🧑‍🎨 Profile Management with Avatar Upload (Cloudinary)

🟢 Online User Status Indicator

✍️ Typing Indicator

📱 Responsive UI with Tailwind CSS + DaisyUI

🌓 Theme Switching (Light/Dark Mode)

⚛️ Modern React (Hooks, Zustand for Global State)

🍪 Secure Cookies and JWT Authentication

🛠️ Tech Stack
🔹 Frontend
React ⚛️

Zustand 🧠

React Router 🧭

DaisyUI 🌼

Tailwind CSS 💨

Axios 🌐

Socket.IO Client 🧲

🔹 Backend
Node.js 🟩

Express 🚂

MongoDB (Mongoose) 🍃

Socket.IO 📡

Cloudinary ☁️

JWT 🛡️

bcryptjs 🔑

🔹 Dev Tools
Vite ⚡

ESLint 🧹

Nodemon 🔄

📁 Project Structure
vbnet
Copy
Edit
CHAT-APP/
│
├── backend/
│   ├── controllers/
│   ├── lib/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── index.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── store/
│   ├── index.html
│   └── ...
│
├── package.json
└── ...
🚀 Getting Started
✅ Prerequisites
Node.js (v18+ recommended)

MongoDB database (Atlas or Local)

Cloudinary Account (for image uploads)

1️⃣ Clone the Repository
bash
Copy
Edit
git clone https://github.com/Ayushkumar111/chat-app.git
cd chat-app
2️⃣ Backend Setup
bash
Copy
Edit
cd backend
npm install
Create a .env file in the backend/ folder:

env
Copy
Edit
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
3️⃣ Frontend Setup
bash
Copy
Edit
cd ../frontend
npm install
4️⃣ Run the App
▶️ Start Backend
bash
Copy
Edit
cd ../backend
npm run dev
▶️ Start Frontend
bash
Copy
Edit
cd ../frontend
npm run dev
🌐 Frontend: http://localhost:5173

🔗 Backend API: http://localhost:5000

🏗️ Build for Production
bash
Copy
Edit
cd frontend
npm run build
➡️ Production build will be available in the dist/ folder.

🌍 Environment Variables
See .env file for all required environment variables.

🎨 Customization
Themes: Add/modify themes in index.js.

Cloudinary: Image uploads are managed through Cloudinary. Configure your credentials in .env.


🖼️Screenshots
![image](https://github.com/user-attachments/assets/b4570d81-075b-4cea-87ee-908de43d7de6)
![image](https://github.com/user-attachments/assets/db72007a-f3e3-47e7-80ee-bda9d1326be7)
![image](https://github.com/user-attachments/assets/a9c3d3bf-d0b2-498a-8739-3a41d54daadf)
![image](https://github.com/user-attachments/assets/b132e794-266a-4e6a-b8b8-3d01a5ea91d4)



🤝 Contributing
Pull requests are welcome!
For major changes, please open an issue first to discuss what you'd like to change.

📬 Contact
For any queries or suggestions, feel free to reach out at:
📧 workmailayush04@gmail.com

📜 License
Licensed under the MIT License.

🚀 Happy Chatting!
Made with ❤️ by Ayush
