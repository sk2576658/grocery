import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {

  const newDate = new Date()
 const month_name=newDate.toLocaleString('default', { month: 'long' })

  const [groceryData, setgroceryData] = useState([]);

  useEffect(() => {
    getGrocery();
}, [])

  function getGrocery() {

    axios.get('/grocery/getall').then((res) => {
      setgroceryData(res.data);
    })
  }

  const [itemData, setItemData] = useState({
  groceryItem: "",
    isPurchased: false
  });

  const inputDataEvent = (event) => {
    const { name, value } = event.target;
    setItemData((prevValue) => {
      return {
        ...prevValue,
        [name]: value
      }
    })
  }

  const addNewData = () => {

    if (itemData.groceryItem !== "") {

      setgroceryData((preValue) => {
        return [...preValue,itemData]
      })

      const groceryData = {
        groceryItem: itemData.groceryItem,
        isPurchased: itemData.isPurchased
      }

      axios.post('/grocery/add', groceryData)

      getGrocery();

      setItemData({ ...itemData, groceryItem: '' })

    }
  }
  function updateItemStatus(index,item) {

    const groceryState = {
      _id:item._id,
      isPurchased: true
    }
    axios.put('/grocery/updatePurchaseStatus', groceryState)
    getGrocery();
  }

  function eventPrevention(event) {
    event.preventDefault();
  }

  function itemDelete(index,item) {
    const data = {
      _id: item._id
    }
    axios.delete('/grocery/deleteGroceryItem', { data });

    getGrocery();
  }

  return ( <div className="container">
        <nav className="header_part"><h1>Monthly Grocery Planning App</h1></nav>
        <div className="heading">
        <h1>Plan for the month of {month_name}</h1> 
        <form className="form_data" onSubmit={eventPrevention}>
            <input type="text" name="groceryItem" value={itemData.groceryItem} onChange={inputDataEvent} placeholder="Add Shopping Item"/>
            <button className="sub_butn" onClick={addNewData}>Submit</button>
            {groceryData.length!== 0 &&
             <div>
             {groceryData.map((item,index)=> {
               
                 return <div className="style_data" key={index}>
                 <span className="grocery_data"style={{textDecoration:item.isPurchased?"line-through":'none'}}>{item.groceryItem}</span>
                 <button className="pur_btn"onClick={()=> updateItemStatus(index,item)}>Purchase</button>
                 <button className="del_btn" onClick={()=>itemDelete(index,item)}>X</button></div>
                                 
 })}
             </div>}
           
        </form>
        </div>
    </div>
  );
}

export default App
