import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Plus, Minus, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { GetCartApi, RemoveFromCartApi, UpdateCartQtyApi } from "../../../Redux/service/AllApi";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper to get unique product ID
  const getId = (item) => item.productId?._id || item._id || item.id;

  // Fetch user cart from Backend API
  const fetchCart = async () => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");

    if (!token) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    const reqHeader = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const result = await GetCartApi(reqHeader);
      if (result && result.status === 200) {
        let items = result.data.items || result.data.products || result.data || [];

        // 🟢 സുരക്ഷാ മാറ്റം: അഡ്മിൻ പ്രൊഡക്റ്റ് ഡിലീറ്റ് ചെയ്തിട്ടുണ്ടെങ്കിൽ അത് കാർട്ടിൽ എറർ വരുത്താതിരിക്കാൻ
        items = Array.isArray(items) ? items.filter((item) => item.productId != null) : [];

        setCartItems(items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      toast.error("Failed to load cart");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Remove an item
  const handleRemoveItem = async (itemId) => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) return;

    const reqHeader = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const result = await RemoveFromCartApi(itemId, reqHeader);
      if (result && (result.status === 200 || result.status === 204)) {
        toast.info("Item removed from cart");
        fetchCart(); // ഡിലീറ്റ് ചെയ്ത ശേഷം കാർട്ട് പുതുക്കുന്നു
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err) {
      toast.error("Could not remove item");
    }
  };

  // Update quantity
  const updateQty = async (itemId, amount) => {
    const item = cartItems.find((i) => getId(i) === itemId);
    if (!item) return;

    const currentQty = item.quantity || item.qty || 1;
    const newQty = Math.max(1, currentQty + amount); // എണ്ണം 1-ൽ താഴെ പോകാതിരിക്കാൻ

    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) return;

    const reqHeader = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const result = await UpdateCartQtyApi(itemId, { quantity: newQty }, reqHeader);
      if (result && result.status === 200) {
        fetchCart(); // എണ്ണം മാറ്റിയ ശേഷം കാർട്ട് പുതുക്കുന്നു
      }
    } catch (err) {
      console.error("Failed to update quantity:", err);
      toast.error("Failed to update quantity");
    }
  };

  return (
    <div className="cart-page-wrapper bg-light min-vh-100 py-5">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div className="text-start">
            <Link
              to="/products"
              className="text-decoration-none text-muted small fw-bold d-flex align-items-center mb-2 hover-success transition"
            >
              <ArrowLeft size={16} className="me-1" /> CONTINUE SHOPPING
            </Link>
            <h1 className="fw-black mb-0 display-5">Shopping Cart</h1>
          </div>
          <div className="text-end d-none d-md-block">
            <span className="text-muted fw-bold">{cartItems.length} ITEMS</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-5 shadow-sm animate-fade-in border">
            <ShoppingBag size={100} className="text-success mb-4 mx-auto opacity-25" />
            <h2 className="fw-bold">Your cart is empty</h2>
            <p className="text-muted mb-4 fs-5">Looks like you haven't added anything yet.</p>
            <Link to="/products" className="btn btn-success btn-lg px-5 py-3 rounded-pill fw-bold shadow">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {/* Table Header */}
              <div className="d-none d-md-grid grid-header px-4 mb-3 text-muted small fw-bold">
                <div>PRODUCT</div>
                <div className="text-center">QUANTITY</div>
                <div className="text-end">TOTAL</div>
              </div>

              {/* Cart Items */}
              <div className="cart-list mb-4">
                {cartItems.map((item) => {
                  const product = item.productId || item;
                  const pId = getId(item);
                  const qty = item.quantity || item.qty || 1;
                  const price = Number(product.price || item.price) || 0;

                  return (
                    <div
                      key={pId}
                      className="card border-0 shadow-sm rounded-4 mb-3 overflow-hidden hover-shadow transition"
                    >
                      <div className="card-body p-4">
                        <div className="row align-items-center">
                          {/* Image & Info */}
                          <div className="col-md-6 d-flex align-items-center gap-4">
                            <Link
                              to={`/product/${pId}`}
                              className="flex-shrink-0 overflow-hidden rounded-4 border shadow-sm img-hover-container"
                            >
                              <img
                                src={product.image || product.imageUrl || "https://placehold.co/100"}
                                alt={product.name || "Product"}
                                className="cart-item-img transition"
                                style={{ width: "110px", height: "110px", objectFit: "cover" }}
                              />
                            </Link>
                            <div className="text-start">
                              <Link to={`/product/${pId}`} className="text-decoration-none">
                                <h5 className="fw-bold mb-1 text-dark hover-success transition">{product.name}</h5>
                              </Link>
                              <p className="text-muted small mb-2">Unit Price: ₹{price}</p>
                              <button
                                onClick={() => handleRemoveItem(pId)}
                                className="btn btn-link text-danger p-0 small fw-bold text-decoration-none hover-opacity"
                              >
                                REMOVE
                              </button>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="col-md-3 col-6 mt-3 mt-md-0 d-flex justify-content-md-center">
                            <div className="d-flex align-items-center border rounded-pill bg-white px-2 py-1 shadow-sm">
                              <button onClick={() => updateQty(pId, -1)} className="btn btn-sm border-0 rounded-circle p-2">
                                <Minus size={14} />
                              </button>
                              <span className="px-3 fw-bold fs-5">{qty}</span>
                              <button onClick={() => updateQty(pId, 1)} className="btn btn-sm border-0 rounded-circle p-2">
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Subtotal */}
                          <div className="col-md-3 col-6 mt-3 mt-md-0 text-end">
                            <h4 className="fw-black text-dark mb-0">₹{(price * qty).toLocaleString()}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Styles */}
      <style>{`
        .fw-black { font-weight: 900; }
        .grid-header { display: grid; grid-template-columns: 2fr 1fr 1fr; }
        .hover-shadow:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important; }
        .hover-scale:hover { transform: scale(1.03); }
        .hover-success:hover { color: #198754 !important; }
        .transition { transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); }
        .img-hover-container:hover .cart-item-img { transform: scale(1.1); }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default CartPage;
