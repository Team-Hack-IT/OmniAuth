import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignInPage from './components/SignInPage.jsx';
import { AuthProvider } from '@descope/react-sdk';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signin",
    element: <SignInPage />,
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <AuthProvider projectId='P2bMT7le7rEj4uL9gVKZpK9Kd6Md'>
        <SignInPage />
        <App />
      </AuthProvider>
    </RouterProvider>
  </React.StrictMode>
);

