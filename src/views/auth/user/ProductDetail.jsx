import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, Zap } from "lucide-react";
import { GetProductByIdApi } from "../../../Redux/service/AllApi";
import { toast } from "react-toastify";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await GetProductByIdApi(id);
      if (res.status === 200) {
        setProduct(res.data);
      } else {
        toast.error("Product not found!");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Error loading product details");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    const sId = product.sellerId || product.user || product.userId;
    const directItem = {
      _id: product._id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      image: product.imageUrl || product.image,
      sellerId: sId,
    };
    sessionStorage.setItem("direct_buy", JSON.stringify([directItem]));
    navigate("/checkout?type=direct");
  };

  const handleAddToCart = () => {
    if (!product) return;
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const isExist = cart.find((item) => item._id === product._id);

    if (!isExist) {
      cart.push({
        _id: product._id,
        name: product.name,
        price: Number(product.price),
        quantity: 1,
        image: product.imageUrl || product.image,
        sellerId: product.sellerId || product.user || product.userId,
      });
      sessionStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));
      toast.success("Added to Cart! 🛒");
    } else {
      toast.warn("Item already in cart");
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );

  if (!product) return <div className="text-center py-5">Product not found!</div>;

  return (
    <div className="container py-5 text-start">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-link text-success mb-4 p-0 text-decoration-none d-flex align-items-center fw-bold shadow-none hover-move-left"
      >
        <ArrowLeft size={20} className="me-2 transition-arrow" /> Back to Shop
      </button>

      <div className="row g-5 align-items-center">
        {/* Product Image - FIXED CROPPING ISSUE */}
        <div className="col-md-6 mb-4 mb-md-0">
          <div
            className="card border-1 shadow-sm rounded-4 overflow-hidden bg-white d-flex align-items-center justify-content-center p-4 p-md-5"
            style={{ borderColor: "#f1f3f5", minHeight: "450px" }}
          >
            <img
              src={product.imageUrl || product.image}
              className="img-fluid hover-zoom"
              alt={product.name}
              style={{ width: "100%", height: "100%", maxHeight: "400px", objectFit: "contain" }}
              onError={(e) => (e.target.src = "https://placehold.co/500x500?text=No+Image")}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <span
            className="badge bg-success-subtle text-success mb-3 px-3 py-2 rounded-pill fw-bold"
            style={{ letterSpacing: "0.5px" }}
          >
            {product.category}
          </span>
          <h1 className="fw-black mb-3 text-dark display-6">{product.name}</h1>

          <div className="d-flex align-items-center gap-2 mb-4">
            <h2 className="text-success fw-bold mb-0 display-6">₹{product.price}</h2>
          </div>

          <p className="text-secondary mb-4 fs-5" style={{ lineHeight: "1.8" }}>
            {product.description}
          </p>

          {/* Badges */}
          <div className="row g-3 mb-5 text-start">
            <div className="col-sm-6">
              <div className="p-3 border rounded-4 bg-light shadow-sm d-flex align-items-center gap-3 transition-card">
                <div className="bg-white p-2 rounded-circle shadow-sm d-flex align-items-center justify-content-center">
                  <ShieldCheck className="text-success" size={24} />
                </div>
                <span className="fw-bold text-dark">Eco Verified</span>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="p-3 border rounded-4 bg-light shadow-sm d-flex align-items-center gap-3 transition-card">
                <div className="bg-white p-2 rounded-circle shadow-sm d-flex align-items-center justify-content-center">
                  <Truck className="text-success" size={24} />
                </div>
                <span className="fw-bold text-dark">Fast Delivery</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="d-grid gap-3 d-md-flex">
            <button
              onClick={handleAddToCart}
              className="btn btn-outline-success btn-lg px-4 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 flex-grow-1 shadow-sm hover-btn"
            >
              <ShoppingCart size={22} /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="btn btn-success btn-lg px-4 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 flex-grow-1 shadow hover-btn-fill"
            >
              <Zap size={22} fill="white" /> Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Inline CSS for smooth interactions */}
      <style>{`
                .fw-black { font-weight: 900; }
                .hover-zoom { transition: transform 0.4s ease-in-out; }
                .hover-zoom:hover { transform: scale(1.05); }
                .transition-card { transition: all 0.3s ease; border: 1px solid transparent; }
                .transition-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; border-color: rgba(76, 175, 80, 0.2); }
                .hover-move-left:hover .transition-arrow { transform: translateX(-5px); }
                .transition-arrow { transition: transform 0.3s ease; }
                .hover-btn { transition: all 0.3s ease; }
                .hover-btn:hover { background-color: #f8fdf9; transform: translateY(-2px); }
                .hover-btn-fill { transition: all 0.3s ease; }
                .hover-btn-fill:hover { transform: translateY(-2px); box-shadow: 0 15px 25px rgba(40, 167, 69, 0.2) !important; }
            `}</style>
    </div>
  );
}

export default ProductDetail;
