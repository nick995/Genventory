import { useState, useEffect, useRef } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Item = ({ item, onDelete, onUpdate }) => {
  const handleDelete = async () => {
    try {
      await onDelete(item.id);
    } catch (error) {
      console.error("[Error] deleting item:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await onUpdate(item.id);
    } catch (error) {
      console.error("[Error] updating item:", error);
    }
  };

  return (
    <li>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={handleUpdate}>Update</button>
      {" [" + item.id + "] " + item.name}
    </li>
  );
};

const ItemList = () => {
  const [items, setItems] = useState([]);
  const updatedTextRef = useRef("");

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/items/`);
      setItems(response.data);
    } catch (error) {
      console.error("[Error] getting items:", error);
    }
  };

  const deleteItem = async (itemID) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/items/${itemID}/`);
      await getItems();
    } catch (error) {
      console.error("[Error] deleting item:", error);
    }
  };

  const updateItem = async (itemID) => {
    try {
      await axios.put(`${BACKEND_URL}/api/items/${itemID}/`, {
        name: updatedTextRef.current.value,
      });
      await getItems();
      updatedTextRef.current.value = "";
    } catch (error) {
      console.error("[Error] updating item:", error);
    }
  };

  const postItem = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/items/`, {
        name: updatedTextRef.current.value,
      });
      await getItems();
      updatedTextRef.current.value = "";
    } catch (error) {
      console.error("[Error] posting item:", error);
    }
  };

  return (
    <div>
      <ul>
        <input type="text" ref={updatedTextRef} />
        <button onClick={postItem}>Post</button>
        {items
          .sort((a, b) => a.id - b.id)
          .map((item) => (
            <Item
              key={item.id}
              item={item}
              onDelete={deleteItem}
              onUpdate={updateItem}
            />
          ))}
      </ul>
      <div></div>
    </div>
  );
};

export default ItemList;