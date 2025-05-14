import { useEffect, useState } from "react";
import {
  subscribeBackgroundColor,
} from "../lib/utils/bolt";
import styles from "./main.module.scss";
import ProjectDashboard from "./components/dashboard/ProjectDashboard";
import LoginScreen from "./components/login/LoginScreen";
import { getToken } from "../utils/token/get-token";
import { deleteToken } from "../utils/token/delete-token";
import { revokeTokenOnAPI } from "../services/auth";
import clsx from "clsx";
import LoadingScreen from "./components/loading/LoadingScreen";

enum Screens {
  Loading = "loading",
  Login = "login",
  Dashboard = "dashboard",
}

const Main = () => {
  const [bgColor, setBgColor] = useState("#282c34");
  const [screen, setScreen] = useState<Screens>(Screens.Loading);
  const [themeClass, setThemeClass] = useState<string>(styles.dark);

  const handleLogut = async () => {
    const token = getToken();
    if (!token) return;
    
    deleteToken();
    setScreen(Screens.Login);
    await revokeTokenOnAPI(token);
  }

  useEffect(() => {
    if (window.cep) {
      subscribeBackgroundColor(setBgColor);
    }

    
  }, []);

  useEffect(() => {
    // Check for token every 2 seconds
    const interval = setInterval(() => {
      const token = getToken();
      if (token) {
        setScreen(Screens.Dashboard);
      } else {
        setScreen(Screens.Login);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Map the background color to the corresponding class for theme
    if (bgColor === "rgb(50, 50, 50)") {
      setThemeClass(styles.dark);
    } else if (bgColor === "rgb(83, 83, 83)") {
      setThemeClass(styles.mediumDark);
    } else if (bgColor === "rgb(184, 184, 184)") {
      setThemeClass(styles.mediumLight);
    } else if (bgColor === "rgb(240, 240, 240)") {
      setThemeClass(styles.light);
    } else {
      setThemeClass(styles.dark); // Default to dark
    }
  }, [bgColor]);

  return (
    <div className={clsx(styles.app, themeClass)} style={{ backgroundColor: bgColor }}>
      <div className={styles.container}>
        {screen === Screens.Loading && <LoadingScreen />}
        {screen === Screens.Login && <LoginScreen onAuthenticate={() => setScreen(Screens.Dashboard)} />}
        {screen === Screens.Dashboard && <ProjectDashboard onLogout={handleLogut} />}
      </div>
    </div>
  );
};

export default Main;
