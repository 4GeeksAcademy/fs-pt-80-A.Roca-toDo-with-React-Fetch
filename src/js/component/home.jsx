import React, { useState, useEffect } from "react";

const Home = () => {

  const [inputValue, setInputValue] = useState("");
  const [toDos, setToDos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  // -------------------------------------------------------------------------------
  useEffect(() => {
    createUser();
    getUserData();
  }, [])
  //--------------------------------------------------------------------------------
  const checkUserExist = async () => {
    try {
      const response = await fetch('https://playground.4geeks.com/todo/users/enki', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error("Usuario no encontrado");
      console.log('El usuario ya existe');
      return true;
    } catch (error) {
      console.error('El usuario no existe');
      return false;
    }
  }
  // ------------------------------------------------------------------------------
  const createUser = async () => {
    try {
      const userExist = await checkUserExist();
      if (userExist) return;

      const response = await fetch('https://playground.4geeks.com/todo/users/enki', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log("Todo bien, el usuario ya existe")
      if (!response.ok) throw new Error('Something went wrong!');
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error al crear usuario', error);
    }
  }
  // ----------------------------------------------------------------------------------
  const getUserData = async () => {
    try {
      const response = await fetch('https://playground.4geeks.com/todo/users/enki', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log("Datos extraidos correctamente")
      if (!response.ok) throw new Error('Something went wrong!');
      const data = await response.json();
      setToDos(data.todos || []);
    } catch (error) {
      console.error('Error al extraer los datos del usuario', error);
    }
  }
  //-----------------------------------------------------------------------------------
  const agregarTareas = async (tarea) => {
    try {
      setLoading(true);
      const response = await fetch('https://playground.4geeks.com/todo/todos/enki', {
        method: 'POST',
        body: JSON.stringify({
          label: tarea.label,
          is_done: tarea.is_done || false
        }),
        headers: { "Content-Type": "application/json" },
      });
      console.log("Tarea creada correctamente!!");

      if (!response.ok) throw new Error('Error al agregarla tarea!');
      const data = await response.json();
      setToDos([...toDos, data]);
      console.log(data);
    } catch (error) {
      console.error('Error al crear tareas', error);
    } finally {
      setLoading(false);
    }
  }
  //-------------------------------------------------------------------------------
  const handleInput = (e) => {
    setInputValue(e.target.value);
  };
  //-------------------------------------------------------------------------------
  const handleTask = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;
    const nuevaTarea = { label: inputValue, is_done: false };
    agregarTareas(nuevaTarea);
    setInputValue("");
  }
  // ----------------------------------------------------------------------------
  const eliminarTareas = async (taskId) => {
    try {
      setDeleting(true);
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Error al eliminar los datos del servidor');
      setToDos(prevToDos => prevToDos.filter(task => task.id !== taskId));
      console.log("Tarea eliminada exitosamente del servidor");
    } catch (error) {
      console.error('Error al eliminar tareas del servidor', error);
    } finally {
      setDeleting(false);
    }
  };
  //-------------------------------------------------------------------------------
  return (
    <div className="container">
      <h1>To Do List</h1>
      <form className="formulario" onSubmit={handleTask}>
        <input
          onChange={handleInput}
          type="text"
          value={inputValue}
          placeholder="Add a task"
        />
        <input className="addBtn" type="submit" value="Add" />
      </form>
      {loading && <div class="m-3 d-flex align-items-center">
        <p role="status">Loading...</p>
        <div class="spinner-border ms-auto text-primary" aria-hidden="true"></div>
      </div>}
      {deleting && <div class="m-3 d-flex align-items-center">
        <p role="status">Deleting...</p>
        <div class="spinner-border ms-auto text-primary" aria-hidden="true"></div>
      </div>}
      <ul>
        {toDos.map((task, id) => (
          <li key={id}>
            {task.label}
            <span
              onClick={() => eliminarTareas(task.id)}
              className="papelera fa-regular fa-trash-can"
            ></span>
          </li>
        ))}
      </ul>
      <div className="contador">{`${toDos.length} tasks`}</div>
    </div>
  );
};

export default Home;
