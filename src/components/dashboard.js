import React, { useState, useEffect } from "react";
import { FaBook, FaEye, FaTimes } from "react-icons/fa";
import "./Dashboard.css";

const API_KEY = "YOUR_GOOGLE_PLACES_API_KEY";

function Dashboard() {
  const [view, setView] = useState("list");
  const [newItem, setNewItem] = useState("");
  const [listName, setListName] = useState("");
  const [currentList, setCurrentList] = useState([]);
  const [myLists, setMyLists] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showListPopup, setShowListPopup] = useState(null);
  const [markets, setMarkets] = useState([]);

  const handleAddItem = () => {
    if (newItem.trim() !== "") {
      setCurrentList([...currentList, newItem]);
      setNewItem("");
    }
  };

  const handleCreateNewList = async () => {
    if (listName.trim() !== "" && currentList.length > 0) {
      const token = localStorage.getItem("token");
      console.log("Creating list with name:", listName);
      console.log("Current items:", currentList);

      try {
        const response = await fetch("http://localhost:3000/api/lists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: 1,
            name: listName,
            items: currentList,
          }),
        });

        if (response.ok) {
          console.log("List created successfully");
          const newList = await response.json();
          setMyLists([...myLists, newList]);
          setListName("");
          setCurrentList([]);
          setShowPopup(false);
        } else {
          console.error("Erro ao criar a lista:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao criar a lista:", error);
      }
    } else {
      console.log("List name or items are empty");
    }
  };

  const fetchUserLists = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/api/lists/1", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const lists = await response.json();
        setMyLists(lists);
      } else {
        console.error(
          "Erro ao buscar as listas do usuário:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Erro ao buscar as listas do usuário:", error);
    }
  };

  useEffect(() => {
    fetchUserLists();
  }, []);

  useEffect(() => {
    if (view === "nearbyMarkets") {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=supermarket&key=${API_KEY}`
        )
          .then((response) => response.json())
          .then((data) => setMarkets(data.results))
          .catch((error) =>
            console.error("Error fetching the markets:", error)
          );
      });
    }
  }, [view]);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img src="./assets/logo.jpg" alt="Logo" className="logo" />
        <h2>Painel de Controle</h2>
        <button onClick={() => setView("list")}>Lista</button>
        <button onClick={() => setView("nearbyMarkets")}>
          Mercados Próximos
        </button>
      </div>
      <div className="content">
        {view === "list" && (
          <div className="list-view">
            <h3>Criar sua nova lista aqui:</h3>
            <button
              onClick={() => setShowPopup(true)}
              className="create-list-button"
            >
              <FaBook style={{ marginRight: "8px" }} />
              Criar Nova Lista
            </button>
            <h3>Minhas Listas:</h3>
            <ul className="my-lists">
              {myLists.map((list) => (
                <li key={list.id} className="list-item">
                  <FaBook style={{ marginRight: "8px" }} />
                  <span>{list.name}</span>
                  <button
                    className="view-list-button"
                    onClick={() => setShowListPopup(list.id)}
                  >
                    <FaEye style={{ marginRight: "4px" }} />
                    Visualizar Lista
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {view === "nearbyMarkets" && (
          <div className="nearby-markets-view">
            <h3>Mercados Próximos</h3>
            <ul className="markets-list">
              {markets.map((market) => (
                <li key={market.place_id}>{market.name}</li>
              ))}
            </ul>
          </div>
        )}
        {showPopup && (
          <div className="popup">
            <div className="popup-inner">
              <h3>Nova Lista</h3>
              <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Nome da Lista"
              />
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Adicione um item à lista"
              />
              <button onClick={handleAddItem} className="add-item-button">
                Adicionar Item
              </button>
              <h4>Itens na Lista:</h4>
              <ul>
                {currentList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <div className="popup-buttons">
                <button
                  onClick={handleCreateNewList}
                  className="create-list-button"
                >
                  <FaBook style={{ marginRight: "4px" }} />
                  Criar Lista
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="cancel-button"
                >
                  <FaTimes style={{ marginRight: "4px" }} />
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
        {showListPopup && (
          <div className="popup">
            <div className="popup-inner">
              <h3>Itens na Lista</h3>
              <ul>
                {myLists
                  .find((list) => list.id === showListPopup)
                  .items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
              </ul>
              <div className="popup-buttons">
                <button
                  onClick={() => setShowListPopup(null)}
                  className="cancel-button"
                >
                  <FaTimes style={{ marginRight: "4px" }} />
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
