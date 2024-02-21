import React, { useRef, useState, useEffect } from "react";
import { useAppContext } from "../context/ArrayAppContext";
import toast from "react-hot-toast";

const Home = () => {
  const { web3, connected, account, connecting, connectToMetaMask } =
    useAppContext();
  const [isLoading, setIsLoading] = useState("idle");
  const [data, setData] = useState([]);
  const [number, setNumber] = useState("");
  const [state, setState] = useState({
    numberAdd: "",
    getIndex: "",
    updateValue: "",
    updateIndex: "",
    deleteIndex: "",
  });
  const inputRef = useRef();

  const arrayPrint = data.map((item, index) => {
    return (
      <p key={index}>
        index No. {index + 1} = {item.toString()}
      </p>
    );
  });

  const getArray = async () => {
    try {
      setIsLoading("fetching");
      const array = await web3.methods.allItems().call();
      setIsLoading("idle");

      setData(array);
    } catch (error) {
      setIsLoading("idle");
      console.log(error);
      toast.error("Error fetching data!");
    }
  };

  const handleGetNumber = async (e) => {
    e.preventDefault();
    if (state.getIndex === "") {
      toast.error("empty field");
      return;
    }
    try {
      setIsLoading("getting");
      if (!account) {
        toast.error("please connect your wallet first");
        setIsLoading("idle");
        return;
      }
      const num = await web3.methods.getNumber(state.getIndex).call();
      setState({ ...state, getIndex: "" });
      setIsLoading("idle");

      setNumber(num);
    } catch (error) {
      setIsLoading("idle");
      console.log(error);
      toast.error("Error fetching data!");
    }
  };

  const handleAddNumber = async (e) => {
    e.preventDefault();
    if (state.numberAdd === "") {
      toast.error("empty field");
      return;
    }
    try {
      setIsLoading("adding");
      if (!account) {
        toast.error("please connect your wallet first");
        setIsLoading("idle");
        return;
      }
      await web3.methods
        .addNumber(state.numberAdd)
        .send({ from: account, gas: 3000000 })
        .on("receipt", () => {
          setState({ ...state, numberAdd: "" });
          getArray();

          toast.success("number added successfully");
          setIsLoading("idle");
        })
        .on("error", () => {
          throw new Error("error in adding number in try");
        });
    } catch (err) {
      console.log(err);
      toast.error("error  adding number");
      setIsLoading("idle");
    }
  };
  const handleDeleteNumber = async (e) => {
    e.preventDefault();
    if (state.deleteIndex === "") {
      toast.error("empty field");
      return;
    }

    try {
      setIsLoading("deleting");
      if (!account) {
        toast.error("please connect your wallet first");
        setIsLoading("idle");
        return;
      }
      const del = await web3.methods
        .removeItem(state.deleteIndex)
        .send({ from: account, gas: 3000000 })
        .on("receipt", () => {
          setState({ ...state, deleteIndex: "" });
          getArray();

          toast.success("number deleted successfully");
          setIsLoading("idle");
        })
        .on("error", () => {
          throw new Error("error in adding number in try");
        });
    } catch (error) {
      setIsLoading("idle");
      console.log(error);
      toast.error("Error deleting data!");
    }
  };
  const handleUpdateNumber = async (e) => {
    e.preventDefault();

    if (state.updateValue === "" || state.updateIndex === "") {
      toast.error("empty field");
      return;
    }
    try {
      setIsLoading("updating");
      if (!account) {
        toast.error("please connect your wallet first");
        setIsLoading("idle");
        return;
      }

      const update = await web3.methods
        .updateItem(state.updateIndex, state.updateValue)
        .send({ from: account, gas: 3000000 })
        .on("receipt", () => {
          setState({ ...state, updateIndex: "", updateValue: "" });
          getArray();

          toast.success("number updated successfully");
          setIsLoading("idle");
        })
        .on("error", () => {
          throw new Error("error in adding number in try");
        });
    } catch (error) {
      setIsLoading("idle");
      console.log(error);
      toast.error("Error updating data!");
    }
  };
  useEffect(() => {
    if (connected) {
      getArray();
    }
  }, [connected]);
  return (
    <div>
      <div>
        <div>
          {!connected && (
            <button onClick={connectToMetaMask}>
              {connecting ? "connecting..." : "connect to metamask"}
            </button>
          )}
        </div>
        <div>
          {isLoading === "fetching" ? <p>fetching data...</p> : arrayPrint}
        </div>
        <div>
          <form action="" onSubmit={handleAddNumber}>
            <input
              type="number"
              name="number"
              id="number"
              placeholder="enter number"
              onChange={(e) =>
                setState({ ...state, numberAdd: e.target.value })
              }
              value={state.numberAdd}
              disabled={!connected}
            />
            <button
              type="submit"
              disabled={!connected || isLoading === "adding"}
            >
              {isLoading === "adding" ? "Adding" : "Add Number"}
            </button>
          </form>
        </div>
      </div>
      <hr />
      <div>
        <form action="" onSubmit={handleGetNumber}>
          <input
            type="number"
            id="getNumber"
            name="getNumber"
            placeholder="enter number"
            onChange={(e) => {
              setState({ ...state, getIndex: e.target.value });
            }}
            value={state.getIndex}
            disabled={!connected}
          />
          <button
            type="submit"
            disabled={!connected || isLoading === "getting"}
          >
            {isLoading === "getting" ? " Getting" : "Get Number by index"}
          </button>
        </form>
        {isLoading === "getting" ? (
          <p>fetching number....</p>
        ) : (
          <p>
            {number.toString()
              ? `number is ${number.toString()}`
              : "enter index in above field"}
          </p>
        )}
      </div>
      <hr />
      <div>
        <form action="" onSubmit={handleUpdateNumber}>
          <input
            type="text"
            id="updateInputNumber"
            name="updateInputNumber"
            placeholder="enter update value"
            onChange={(e) =>
              setState({
                ...state,
                updateValue: e.target.value,
              })
            }
            value={state.updateValue}
            disabled={!connected}
          />
          <input
            type="text"
            id="updateIndexNumber"
            name="updateIndexNumber"
            placeholder="enter index value"
            onChange={(e) =>
              setState({
                ...state,
                updateIndex: e.target.value,
              })
            }
            value={state.updateIndex}
            disabled={!connected}
          />
          <button
            type="submit"
            disabled={!connected || isLoading === "updating"}
          >
            {isLoading === "updating"
              ? " Updating..."
              : "Update Number by index"}
          </button>
        </form>
      </div>
      <hr />
      <div>
        <form onSubmit={handleDeleteNumber}>
          <input
            type="text"
            id="deleteIndexNumber"
            name="deleteIndexNumber"
            placeholder="enter delete value"
            onChange={(e) =>
              setState({
                ...state,
                deleteIndex: e.target.value,
              })
            }
            value={state.deleteIndex}
            disabled={!connected}
          />

          <button
            type="submit"
            disabled={!connected || isLoading === "deleting"}
          >
            {isLoading === "deleting" ? " deleting" : "Delete Number by index"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
