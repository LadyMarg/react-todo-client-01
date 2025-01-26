import { useEffect, useState } from "react";
import pen from "./assets/pen-solid.svg";
import clip from "./assets/clipboard-list-solid.svg";
import trash from "./assets/trash-can-solid.svg";
import {
  readTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./functions/index.js";
import Preloader from "./components/Preloader";

function App() {
  const [todo, setTodo] = useState({ title: "", content: "" });
  const [todos, setTodos] = useState(null);
  const [currentId, setCurrentId] = useState(0);

  useEffect(() => {
    let currentTodo =
      currentId !== 0
        ? todos.find((todo) => todo._id === currentId)
        : { title: "", content: "" };
    setTodo(currentTodo);
  }, [todos, currentId]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await readTodos();
      setTodos(result);
    };
    fetchData();
  }, [currentId]);

  const clear = () => {
    setCurrentId(0);
    setTodo({ title: "", content: "" });
  };

  useEffect(() => {
    const clearField = (e) => {
      if (e.keyCode === 27) {
        clear();
      }
    };
    window.addEventListener("keydown", clearField);
    return () => window.removeEventListener("keydown", clearField);
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (currentId === 0) {
      const result = await createTodo(todo);
      setTodos([...todos, result]);
      clear();
    } else {
      await updateTodo(currentId, todo);
      clear();
    }
  };

  const removeTodo = async (id) => {
    await deleteTodo(id);
    const todosCopy = [...todos];
    todosCopy.filter((todo) => todo._id !== id);
    setTodos(todosCopy);
  };

  return (
    <div className="container mx-auto">
      <h1 className="font-extrabold text-3xl text-white flex items-center justify-center mt-8">
       Lady_Marg_Opeo ToDo App
      </h1>
      <div className="bg-blue-200 flex items-center justify-center mt-8">
        <form
          className="mt-5 pl-10 pr-5 py-8 border rounded-sm border-black"
          onSubmit={onSubmitHandler}
        >
          <div className="grid grid-rows-2 grid-cols-1">
            <div className="relative border-b-2 border-solid border-black mx-4">
              <span className="absolute -left-10 top-2.5">
                <img src={pen} alt="pen" height={30} width={30} />
              </span>
              <input
                type="text"
                name="title"
                id="title"
                className="form-input w-full px-1 h-10 border-none focus:ring-0 focus:border-none text-base text-black bg-transparent peer"
                required
                onChange={(e) => setTodo({ ...todo, title: e.target.value })}
                value={todo.title}
              />
              <label
                htmlFor="title"
                className="absolute top-[50%] left-1 text-gray-800 -translate-y-2/4 text-base pointer-events-none transition-[0.5s] peer-focus:-top-1 peer-focus:text-gray-400 peer-valid:-top-1 peer-valid:text-gray-400"
              >
                Task Title
              </label>
            </div>
          </div>
          <div className="md:flex md:justify-center md:items-center relative border-b-2 border-solid border-black mb-8 mx-4">
            <span className="absolute -left-10 top-2.5">
              <img src={clip} alt="clipboard" height={30} width={30} />
            </span>
            <textarea
              name="content"
              id="content"
              cols={20}
              rows={5}
              className="form-input resize-none w-full px-1 h-10 border-none focus:ring-0 focus:border-none text-base text-black bg-transparent peer"
              required
              onChange={(e) => setTodo({ ...todo, content: e.target.value })}
              value={todo.content}
            />
            <label
              htmlFor="content"
              className="absolute top-[50%] left-1 text-gray-800 -translate-y-2/4 text-base pointer-events-none transition-[0.5s] peer-focus:-top-1 peer-focus:text-gray-400 peer-valid:-top-1 peer-valid:text-gray-400"
            >
              Task Contents
            </label>
          </div>
          <div className="flex justify-center items-center mt-3 mb-2">
            <input
              type="submit"
              defaultValue="Add"
              className="flex items-center justify-center px-8 py-1.5 border border-transparent cursor-pointer text-base leading-6 font-medium md:py-1.5 md:text-lg md:px-10 bg-neutral-900 text-neutral-200 border-neutral-900 hover:translate-x-3 transition-transform ease-in-out duration-500 shadow-md shadow-neutral-700 hover:shadow-none "
              placeholder="Add"
            />
          </div>
        </form>
      </div>

      <div className="container mx-auto w-[50%] mt-10 ">
        {!todos ? (
          <Preloader />
        ) : todos.length > 0 ? (
          <ul className="mt-12 grid grid-row border border-b-0 border-black rounded-md mb-10">
            {todos.map((todo) => (
              <li
                key={todo._id}
                onClick={() => setCurrentId(todo._id)}
                className="py-5 pl-4 pr-2 border-b border-black relative cursor-pointer"
              >
                <div>
                  <h5 className="text-xl font-semibold capitalize">
                    {todo.title}
                  </h5>
                  <p className="text-md font-normal pr-4">
                    {todo.content}
                    <a
                      href="#!"
                      onClick={() => {
                        removeTodo(todo._id);
                        window.location.reload(false);
                      }}
                      className="absolute right-3"
                    >
                      <img
                        src={trash}
                        alt="trash icon"
                        height={30}
                        width={20}
                      />
                    </a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <h4>No tasks yet</h4>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
