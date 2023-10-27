import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Home from './Page/home';
import SingUP from './Page/singup';
import LogIn from './Page/login';
import Form2 from './Page/form/form2';
import Form3 from './Page/form/form3';
import Form4 from './Page/form/form4';
import Form5 from './Page/form/form5';
import Form6 from './Page/form/form6';
import Description from './Page/Description';
import Card from './Page/card';
import Card2 from './Page/card2';
import Profile from './Page/profile';
import Edit from './Page/edit';
import Edit2 from './Page/edit2';
import Filter from './Page/filter';
import Premium from './Page/premium';
import Sympathy from './Page/sympathy';
import Match from './Page/match';
import reportWebVitals from './reportWebVitals';
import EditInterests from './Page/edit_interests';
import "./global.css";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "edit-interests",
    element: <EditInterests />,
  },
  {
    path: "singup",
    element: <SingUP />,
  },
  {
    path: "login",
    element: <LogIn />,
  },
  {
    path: "form",
    element: <App />,
  },
  {
    path: "form2",
    element: <Form2 />,
  },
  {
    path: "form3",
    element: <Form3 />,
  },
  {
    path: "form4",
    element: <Form4 />,
  },
  {
    path: "form5",
    element: <Form5 />,
  },
  {
    path: "form6",
    element: <Form6 />,
  },
  {
    path: "/",
    element: <Description />,
  },
  {
    path: "card",
    element: <Card />,
  },
  {
    path: "card2",
    element: <Card2 />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "edit",
    element: <Edit />,
  },
  {
    path: "edit2",
    element: <Edit2 />,
  },
  {
    path: "filter",
    element: <Filter />,
  },
  {
    path: "premium",
    element: <Premium />,
  },
  {
    path: "sympathy",
    element: <Sympathy />,
  },
  {
    path: "match",
    element: <Match />,
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
