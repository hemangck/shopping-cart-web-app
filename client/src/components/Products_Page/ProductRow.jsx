import { useState } from "react";

/* function for each product
  made this function because 
  it will be benificial for setting 
  different state for qty for each product */
function ProductRow({ product, onAdd }) {
  const [qty, setQty] = useState("");

  const handleAdd = () => {
    onAdd(product.name, product.price, qty, product.id);
    setQty("");
  };

  // rendering product row component
  return (
    <div>
      <input
        type="number"
        min={0}
        max={100}
        style={{ width: "4vw" }}
        value={qty}
        onChange={(e) => {
          const n = e.target.valueAsNumber;
          setQty(Number.isFinite(n) ? n : "");
        }}
      />
      <button className="btn btn-primary" style={{ marginLeft: "2vw" }} onClick={handleAdd}>
        Add to Cart !
      </button>
    </div>
  );
}

export default ProductRow;