import { useState, useEffect } from "react";
import ToastMsg from "../Toast_Message/ToastMsg.jsx";
import ProductRow from "./ProductRow.jsx"
import Modal from "../Cart_Modal/Modal.jsx";

// storing key for local storage
const STORAGE_KEY = "cart";

function Products() {
    // defining the required states
    const [products, setProducts] = useState([]);
    const [toast, setToast] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // setting cart state by checking from local storage
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });


    // fetch and store products in a state
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/products`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    // printing cart state on updation and updating it in local storage
    useEffect(() => {
        console.log("cart updated:", cart);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }, [cart]);

    // defining the function for Add to Cart button
    const addProduct = (name, price, qty, pId) => {
        // showing toast for button click without choosing quantity
        if (!qty || Number(qty) <= 0) {
            setToast({ id: Date.now(), opType: "warning", msg: "Please select the quantity!" });
            return;
        }

        // creating dictionary for product details
        const newItem = {
            name,
            price: Number(price),
            quantity: Number(qty),
            id: pId,
        };

        // updating the state
        setCart((prev) => {
            // checking the existence of item by id
            const existingIndex = prev.findIndex((item) => item.id === pId);

            if (existingIndex !== -1) {
                // if item already exists then update qty
                const updatedCart = [...prev];
                updatedCart[existingIndex] = {
                    ...updatedCart[existingIndex],
                    quantity: updatedCart[existingIndex].quantity + newItem.quantity,
                };
                return updatedCart;
            } else {
                // if item not exist then appending it to existing state
                return [...prev, newItem];
            }
        });

        // displaying success toast message
        setToast({ id: Date.now(), opType: "success", msg: "Added to cart." });
    };

    // render products page
    return (
        <div style={{textAlign:"center"}}>
            <h1 style={{margin: "10vh 10vh"}}>Simple Shopping Cart</h1>

            <table>

                <tbody>
                    {products.map((product) => (

                        <tr key={product.id} style={{ display: "inline" }}>
                            <td>
                                <div className="card" style={{ width: "18rem", objectFit: "cover" }}>
                                    <img src={product.imageUrl} className="card-img-top" alt="..." style={{ width: "100%", height: "300px", objectFit: "cover" }} />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">{product.price} Rs.</p>

                                        <span style={{ display: "inline" }}>
                                            <ProductRow key={product.id} product={product} onAdd={addProduct} />
                                        </span>

                                    </div>
                                </div>
                            </td>

                        </tr>

                    ))}
                </tbody>
            </table>

            <button className="btn btn-warning btn-lg" style={{margin: "10vh 10vh"}} id="b1" onClick={() => setIsModalOpen(true)}>Go to Cart</button>

            {/* Render toast if set */}
            {toast && <ToastMsg key={toast.id} opType={toast.opType} msg={toast.msg} />}
            
            {/* Render modal if set */}
            {isModalOpen && (
                <Modal
                    cartObj={cart}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

        </div>
    );
}

export default Products;