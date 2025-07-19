import React, { useEffect, useState } from 'react'
import './NewCollections.css'
import Item from '../Item/Item'
const API = import.meta.env.VITE_API_BASE_URL;  // Use environment variable for API base URL

const NewCollections = () => {
  const [new_collection, setNew_Collection] = useState([]);

  useEffect(() => {
    fetch(`${API}/new-collections`)  // Fetch new collections from the API
    .then(res => res.json())
    .then(data => setNew_Collection(data));
  },[])

  return (
    <div className='new-collections' id="collections">  {/* Added id here */}
        <h1>New Collections</h1>
        <hr />
        <div className="collections">
            {new_collection.map((item,i) => {
                return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
            })}
        </div>
    </div>
  )
}

export default NewCollections