import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import "./priceList.css";

const PriceList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const categories = [
    "Carnes",
    "Laticínio",
    "Alimento Básico",
    "Bebida",
    "Hortifrúti",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/prices/sorted?order=desc"
        );
        console.log("Dados recebidos:", response.data);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) =>
          product.tipo.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div>
      <div className="filter-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Filtrar por categoria ou digitar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            list="category-options"
          />
          <datalist id="category-options">
            {categories.map((category, index) => (
              <option key={index} value={category} />
            ))}
          </datalist>
        </div>
      </div>

      <ul>
        {currentProducts.map((product, index) => (
          <li key={index} className="product-item">
            <span>{product.produto}</span>
            <span> | Unidade: {product.unidade}</span>
            <span> | Preço Máximo: R$ {product.precoMax.toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PriceList;
