import React, { useState } from 'react';
import { connect, useDispatch, useSelector  } from 'react-redux';
import { AuthUser } from '../redux/actions/authActions.js';
import { useNavigate } from 'react-router-dom';
import "./css/Login.css"

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');
  const history = useNavigate();

  const dispatch = useDispatch();
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!email) {
      errors.email = "Debe ingresar un correo electrónico.";
    } 
    if (!password) {
      errors.password = "Debe ingresar una contraseña.";
    }
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    try {
      await dispatch(AuthUser(email, password));
      history('/welcome');

    } catch (error) {
      setErrors({ submit: error.message });
    }
  };
  

  return (
    <div className="login-container">
    <h1 className="website-title">Website</h1>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Correo electrónico</label>
        <input 
          type="email" 
          className={`form-control ${errors.email ? "is-invalid" : ""}`} 
          id="email" 
          value={email} 
          onChange={handleEmailChange} 
          placeholder="Ingrese su correo electrónico" 
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input 
          type="password" 
          className={`form-control ${errors.password ? "is-invalid" : ""}`} 
          id="password" 
          value={password} 
          onChange={handlePasswordChange} 
          placeholder="Ingrese su contraseña" 
        />
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
      </div>
      {errors.submit && <div className="alert alert-danger mt-3">{errors.submit}</div>}
      <button type="submit" className="btn btn-primary mt-3">Iniciar sesión</button>
    </form>
    </div>

  );
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(mapStateToProps, { AuthUser })(Login);
