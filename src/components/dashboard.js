import React, { useState, useEffect } from "react";
import {
  FaBook,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSearch,
  FaShoppingCart,
} from "react-icons/fa";
import PriceList from "./princeList";
// import logo from "../assets/logo.png";
import "./Dashboard.css";
import "./utils/location.css";
import { getNearbyMarkets } from "./utils/location";

function Dashboard() {
  const [view, setView] = useState("list");
  const [newItem, setNewItem] = useState("");
  const [listName, setListName] = useState("");
  const [currentList, setCurrentList] = useState([]);
  const [myLists, setMyLists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLng, setCurrentLng] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editListData, setEditListData] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMarkets = markets.filter((market) =>
    market.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const marketsPerPage = 3;
  const indexOfLastMarket = currentPage * marketsPerPage;
  const indexOfFirstMarket = indexOfLastMarket - marketsPerPage;
  const currentMarkets = filteredMarkets.slice(
    indexOfFirstMarket,
    indexOfLastMarket
  );

  const filteredLists = myLists.filter((list) =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFilteredItems = filteredLists.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
          setEditListData(null);
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
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Obtido geolocalização:", { latitude, longitude });
          setCurrentLat(latitude);
          setCurrentLng(longitude);
          try {
            const markets = await getNearbyMarkets(latitude, longitude);
            console.log("Mercados recebidos:", markets);
            const sortedMarkets = markets.sort(
              (a, b) =>
                calculateDistance(
                  a.geometry.location.lat,
                  a.geometry.location.lng,
                  latitude,
                  longitude
                ) -
                calculateDistance(
                  b.geometry.location.lat,
                  b.geometry.location.lng,
                  latitude,
                  longitude
                )
            );
            setMarkets(sortedMarkets);
          } catch (error) {
            console.error("Erro ao obter mercados:", error);
          }
        },
        (error) => {
          console.error("Erro na geolocalização:", error);
          const latitude = -23.5505;
          const longitude = -46.6333;
          setCurrentLat(latitude);
          setCurrentLng(longitude);
          getNearbyMarkets(latitude, longitude)
            .then((markets) => {
              console.log(
                "Mercados recebidos com coordenadas padrão:",
                markets
              );
              const sortedMarkets = markets.sort(
                (a, b) =>
                  calculateDistance(
                    a.geometry.location.lat,
                    a.geometry.location.lng,
                    latitude,
                    longitude
                  ) -
                  calculateDistance(
                    b.geometry.location.lat,
                    b.geometry.location.lng,
                    latitude,
                    longitude
                  )
              );
              setMarkets(sortedMarkets);
            })
            .catch((error) => {
              console.error(
                "Erro ao obter mercados com coordenadas padrão:",
                error
              );
            });
        }
      );
    }
  }, [view]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d.toFixed(2);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div>
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
            <div className="search-container">
              <input
                type="text"
                placeholder="Pesquisar listas..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <FaSearch className="search-icon" />
            </div>
            <ul className="my-lists">
              {currentFilteredItems.map((list) => (
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
            <div className="pagination">
              {Array.from(
                { length: Math.ceil(filteredLists.length / itemsPerPage) },
                (_, index) => (
                  <button key={index + 1} onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </button>
                )
              )}
            </div>
          </div>
        )}
        {view === "nearbyMarkets" && (
          <div className="nearby-markets-view">
            <h3>Mercados Próximos</h3>
            <input
              type="text"
              className="search-input"
              placeholder="Pesquisar mercado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="markets-list">
              {currentMarkets.map((market) => (
                <a
                  key={market.place_id}
                  href={market.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="market-item"
                >
                  <div className="market-info">
                    <h4 className="market-name">{market.name}</h4>
                    <p className="market-address">{market.vicinity}</p>
                    {currentLat && currentLng && (
                      <p className="market-distance">
                        Distância:{" "}
                        {calculateDistance(
                          market.geometry.location.lat,
                          market.geometry.location.lng,
                          currentLat,
                          currentLng
                        )}{" "}
                        km
                      </p>
                    )}
                  </div>
                  <div className="market-icon-container">
                    <FaShoppingCart className="market-icon" />
                  </div>
                </a>
              ))}
            </div>
            <div className="pagination">
              {[
                ...Array(
                  Math.ceil(filteredMarkets.length / marketsPerPage)
                ).keys(),
              ].map((number) => (
                <button
                  key={number + 1}
                  onClick={() => handlePageChange(number + 1)}
                  className={currentPage === number + 1 ? "active" : ""}
                >
                  {number + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {view === "prices" && (
          <div className="prices-view">
            <h3>Ranking de Produtos por Preço</h3>
            <PriceList /> {}
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
                      className="delete-item-button"
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
                      <FaTrash />
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
