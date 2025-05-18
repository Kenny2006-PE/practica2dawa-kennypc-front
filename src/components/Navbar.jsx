import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detectar scroll para cambiar el estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Independientemente de la respuesta, hacemos logout local
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Aún así, hacemos logout local
      logout();
      navigate("/login");
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? styles.active : "";
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (!currentUser) {
    return (
      <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={styles.container}>
          <div className={styles.logoContainer}>
            <span className={styles.logoIcon}>💊</span>
            <div className={styles.logo}>Sistema de Farmacia</div>
          </div>
          
          <div className={styles.mobileMenuBtn} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <ul className={`${styles.navLinks} ${menuOpen ? styles.menuOpen : ""}`}>
            <li>
              <Link to="/login" className={isActive("/login")}>
                <span className={styles.navIcon}>👤</span>
                <span>Iniciar Sesión</span>
              </Link>
            </li>
            <li>
              <Link to="/register" className={isActive("/register")}>
                <span className={styles.navIcon}>✏️</span>
                <span>Registrarse</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <span className={styles.logoIcon}>💊</span>
          <div className={styles.logo}>Sistema de Farmacia</div>
        </div>
        
        <div className={styles.mobileMenuBtn} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`${styles.navLinks} ${menuOpen ? styles.menuOpen : ""}`}>
          <li>
            <Link to="/dashboard" className={isActive("/dashboard")}>
              <span className={styles.navIcon}>📊</span>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/medicamentos" className={isActive("/medicamentos")}>
              <span className={styles.navIcon}>💉</span>
              <span>Medicamentos</span>
            </Link>
          </li>
          {isAdmin() && (
            <li>
              <Link to="/usuarios" className={isActive("/usuarios")}>
                <span className={styles.navIcon}>👥</span>
                <span>Usuarios</span>
              </Link>
            </li>
          )}
          <li className={styles.profileContainer}>
            <div className={styles.userProfile}>
              <div className={styles.avatar}>
                {currentUser.nombre ? currentUser.nombre.charAt(0).toUpperCase() : "U"}
              </div>
              <span className={styles.userName}>{currentUser.nombre || "Usuario"}</span>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <span className={styles.logoutIcon}>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;