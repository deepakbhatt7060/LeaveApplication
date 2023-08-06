import Home from "./components/Home";
import Admin from "./components/Admin";
import Reset from "./components/Reset";
import Main from "./components/Main";
import Login from "./components/Login";
import First from "./components/First";
const AppRoutes = [
    {
        index: true,
        element: <First />

    },
 {
        path: '/Home',
        element: <Home />
    },
    {
        path: '/Admin',
        element: <Admin />
    },
    {
        path: '/Reset',
        element: <Reset />
    },

    {
        path: '/Login',
        element: <Login />
    },
  {
        path: '/Main',
        element: <Main />
    },
];

export default AppRoutes;
