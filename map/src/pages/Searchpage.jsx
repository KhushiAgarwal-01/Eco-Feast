import React from 'react'
import MapComponent from "../components/MapComponent";
import axios from "axios";
import  { useState, useEffect } from 'react';

function Searchpage() {
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [filteredStores, setFilteredStores] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedStore, setSelectedStore] = useState("");
    const [inventory, setInventory] = useState(null);
    const [search, setSearch] = useState("");
    const [storeType, setStoreType] = useState("");
    const [maxDistance, setMaxDistance] = useState("");
    const [userLocation, setUserLocation] = useState([51.505, -0.09]);
  
    useEffect(() => {
      const fetchProductsAndStores = async () => {
        try {
          const productsResponse = await axios.get(
            "http://localhost:5000/api/products"
          );
          setProducts(productsResponse.data);
  
          // Fetch stores with filters
          const storesResponse = await axios.get(
            "http://localhost:5000/api/stores",
            {
              params: {
                search,
                type: storeType,
                maxDistance,
                lat: userLocation[0],
                lon: userLocation[1],
              },
            }
          );
          setStores(storesResponse.data);
          setFilteredStores(storesResponse.data);
        } catch (error) {
          console.error("Error fetching products or stores:", error);
        }
      };
  
      fetchProductsAndStores();
    }, [search, storeType, maxDistance, userLocation]);
  
    const handleFilterChange = (event) => {
      const { name, value } = event.target;
      if (name === "search") setSearch(value);
      if (name === "storeType") setStoreType(value);
      if (name === "maxDistance") setMaxDistance(value);
    };
  
    const checkInventory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/inventory/${selectedProduct}/${selectedStore}`
        );
        setInventory(response.data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
  return (
    <div className="App">
    <h1>Store Locator & Inventory Checker</h1>
    <MapComponent setSelectedStore={setSelectedStore} />
    <div>
      <label>
        Search Stores:
        <input
          type="text"
          name="search"
          value={search}
          onChange={handleFilterChange}
        />
      </label>
      <label>
        Store Type:
        <select
          name="storeType"
          value={storeType}
          onChange={handleFilterChange}
        >
          <option value="">--All Types--</option>
          <option value="supercenter">Supercenter</option>
          <option value="neighborhood">Neighborhood Market</option>
          {/* Add more types as needed */}
        </select>
      </label>
      <label>
        Max Distance (km):
        <input
          type="number"
          name="maxDistance"
          value={maxDistance}
          onChange={handleFilterChange}
        />
      </label>
    </div>
    <div>
      <label>
        Select Product:
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">--Select Product--</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>
      </label>
      <button
        onClick={checkInventory}
        disabled={!selectedProduct || !selectedStore}
      >
        Check Inventory
      </button>
      {inventory !== null && (
        <div>
          <h2>Inventory Status</h2>
          <p>Quantity: {inventory.quantity}</p>
        </div>
      )}
    </div>
  </div>
  )
}

export default Searchpage
