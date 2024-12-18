import React, { useState, useEffect } from "react";
import { FaBook, FaEye, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import "./Dashboard.css";

const API_KEY = "";

function Dashboard() {
  const [view, setView] = useState("list");
  const [newItem, setNewItem] = useState("");
  const [listName, setListName] = useState("");
  const [currentList, setCurrentList] = useState([]);
  const [myLists, setMyLists] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editListData, setEditListData] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [selectedList, setSelectedList] = useState(null); // Novo estado para armazenar a lista selecionada

  const handleAddItem = () => {
    if (newItem.trim() !== "") {
      setCurrentList([...currentList, newItem]);
      setNewItem("");
    }
  };

  const handleCreateNewList = async () => {
    if (listName.trim() !== "" && currentList.length > 0) {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:3000/api/lists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: listName,
            items: currentList,
          }),
        });

        if (response.ok) {
          const newList = await response.json();
          setMyLists((prevLists) => [...prevLists, newList]);
          setListName("");
          setCurrentList([]);
          setShowPopup(false);
        } else {
          console.error("Erro ao criar a lista:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao criar a lista:", error);
      }
    }
  };

  const handleEditList = async () => {
    if (
      editListData &&
      editListData.name.trim() !== "" &&
      editListData.items.length > 0
    ) {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:3000/api/lists", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editListData),
        });

        if (response.ok) {
          const updatedList = await response.json();
          setMyLists((prevLists) =>
            prevLists.map((list) =>
              list.id === updatedList.id ? updatedList : list
            )
          );
          setEditListData(null); // Fecha a edição
        } else {
          console.error("Erro ao editar a lista:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao editar a lista:", error);
      }
    }
  };

  const handleDeleteList = async (id) => {
    const token = localStorage.getItem("token");

    if (window.confirm("Tem certeza que deseja excluir esta lista?")) {
      try {
        const response = await fetch(`http://localhost:3000/api/lists/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setMyLists((prevLists) => prevLists.filter((list) => list.id !== id));
        } else {
          console.error("Erro ao excluir a lista:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao excluir a lista:", error);
      }
    }
  };

  const fetchUserLists = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/api/lists", {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div>
          <img src="./assets/logo.jpg" alt="Logo" className="logo" />
          <h2>Painel de Controle</h2>
          <button onClick={() => setView("list")}>Lista</button>
          <button onClick={() => setView("nearbyMarkets")}>
            Mercados Próximos
          </button>
          <button onClick={() => setView("prices")}>Preços</button>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Sair
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
                    onClick={() => setSelectedList(list)}
                  >
                    <FaEye style={{ marginRight: "4px" }} />
                    Visualizar
                  </button>
                  <button
                    className="edit-list-button"
                    onClick={() =>
                      setEditListData({
                        id: list.id,
                        name: list.name,
                        items: list.items,
                      })
                    }
                  >
                    <FaEdit style={{ marginRight: "4px" }} />
                    Editar
                  </button>
                  <button
                    className="delete-list-button"
                    onClick={() => handleDeleteList(list.id)}
                  >
                    <FaTrash style={{ marginRight: "4px" }} />
                    Excluir
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

        {view === "prices" && (
          <div className="prices-view">
            <h3>Preços</h3>
            {/*  */}
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

        {selectedList && (
          <div className="popup">
            <div className="popup-inner">
              <h3>{selectedList.name}</h3>
              <ul>
                {selectedList.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedList(null)}
                className="cancel-button"
              >
                <FaTimes style={{ marginRight: "4px" }} />
                Fechar
              </button>
            </div>
          </div>
        )}

        {editListData && (
          <div className="popup">
            <div className="popup-inner">
              <h3>Editar Lista</h3>
              <input
                type="text"
                value={editListData.name}
                onChange={(e) =>
                  setEditListData({ ...editListData, name: e.target.value })
                }
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
                {editListData.items.map((item, index) => (
                  <li key={index}>
                    {item}
                    <button
                      onClick={() => {
                        const updatedItems = editListData.items.filter(
                          (i, idx) => idx !== index
                        );
                        setEditListData({
                          ...editListData,
                          items: updatedItems,
                        });
                      }}
                    >
                      Excluir
                    </button>
                  </li>
                ))}
              </ul>
              <div className="popup-buttons">
                <button onClick={handleEditList} className="create-list-button">
                  <FaEdit style={{ marginRight: "4px" }} />
                  Salvar Edição
                </button>
                <button
                  onClick={() => setEditListData(null)}
                  className="cancel-button"
                >
                  <FaTimes style={{ marginRight: "4px" }} />
                  Cancelar
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
