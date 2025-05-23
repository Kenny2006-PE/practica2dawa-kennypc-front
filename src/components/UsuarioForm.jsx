import { useEffect, useState } from "react";
import styles from "./Forms.module.css";

const UsuarioForm = ({ usuario, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rol: "usuario",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Limpiar error al editar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.rol) {
      newErrors.rol = "El rol es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        {usuario ? "Editar Usuario" : "Nuevo Usuario"}
      </h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingrese el nombre"
            className={errors.nombre ? styles.inputError : ""}
          />
          {errors.nombre && (
            <span className={styles.errorMsg}>{errors.nombre}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            className={errors.email ? styles.inputError : ""}
          />
          {errors.email && (
            <span className={styles.errorMsg}>{errors.email}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="rol">Rol</label>
          <select
            id="rol"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            className={errors.rol ? styles.inputError : ""}
          >
            <option value="usuario">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
          {errors.rol && <span className={styles.errorMsg}>{errors.rol}</span>}
        </div>

        <div className={styles.formFooter}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.btnPrimary}>
            {usuario ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;