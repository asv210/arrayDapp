import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Home from "./components/Home";
import { Toaster } from "react-hot-toast";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Home/>
      <Toaster/>
    </>
  );
}

export default App;
