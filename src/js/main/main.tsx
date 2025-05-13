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

enum Screens {
  Login = "login",
  Dashboard = "dashboard",
}

const Main = () => {
  const [bgColor, setBgColor] = useState("#282c34");
  const [screen, setScreen] = useState<Screens>(Screens.Login);

  //* Demonstration of Traditional string eval-based ExtendScript Interaction
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
    // Check for token every 5 seconds
    const interval = setInterval(() => {
      const token = getToken();
      if (token) {
        setScreen(Screens.Dashboard);
      } else {
        setScreen(Screens.Login);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={styles.app} style={{ backgroundColor: bgColor }}>
      <div className={styles.container}>
        {screen === Screens.Login && <LoginScreen onAuthenticate={() => setScreen(Screens.Dashboard)} />}
        {screen === Screens.Dashboard && <ProjectDashboard onLogout={handleLogut} />}
      </div>
    </div>
  );
};

export default Main;
