import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { ToggleWishlistApi, AddToCartApi } from "../../../Redux/service/AllApi";

function ProductCard({ product, wishlistItems, setWishlistItems }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const isOutOfStock = (product.stock ?? product.quantity) <= 0;

  const navigate = useNavigate();

  useEffect(() => {
    if (wishlistItems) {
      const exists = wishlistItems.some((item) => item._id === product._id);
      setIsWishlisted(exists);
    }
  }, [product._id, wishlistItems]);

  const handleAddToCart = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token") || localStorage.getItem("token");

    if (!token) {
      toast.warning("Please login to add items to cart!");
      navigate("/login");
      return;
    }

    setIsAddingToCart(true); // Show immediate loading feedback

    const reqBody = {
      productId: product._id,
      quantity: 1,
    };

    const reqHeader = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const result = await AddToCartApi(reqBody, reqHeader);

      if (result.status === 200 || result.status === 201) {
        toast.success("Added to cart!");
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        toast.error(result.response?.data || "Failed to add product to cart");
      }
    } catch (error) {
      console.error("Cart Error:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token") || localStorage.getItem("token");

    if (!token) {
      toast.warning("Please login to manage your wishlist!");
      navigate("/login");
      return;
    }

    // Optimistic UI Update: Change color instantly before API call finishes
    const previousState = isWishlisted;
    setIsWishlisted(!previousState);

    const reqHeader = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const result = await ToggleWishlistApi(product._id, reqHeader);

      if (result.status === 200) {
        let currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

        if (!previousState) {
          toast.success("Added to wishlist!");
          currentWishlist.push(product);
        } else {
          toast.info("Removed from wishlist");
          currentWishlist = currentWishlist.filter((item) => item._id !== product._id);
        }

        localStorage.setItem("wishlist", JSON.stringify(currentWishlist));
        window.dispatchEvent(new Event("wishlistUpdated"));
      } else {
        // Revert UI if API fails
        setIsWishlisted(previousState);
        toast.error("Failed to update wishlist");
      }
    } catch (err) {
      // Revert UI if there is an error
      setIsWishlisted(previousState);
      console.error("Wishlist Toggle Error", err);
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="card product-card border-0 shadow-sm rounded-4 overflow-hidden position-relative h-100 transition-all bg-white">
      <div className="position-absolute top-0 start-0 m-3 z-3">
        {isOutOfStock ? (
          <span className="badge bg-danger px-3 py-2 rounded-pill shadow-sm">Out of Stock</span>
        ) : (
          product.isNew && <span className="badge bg-success px-3 py-2 rounded-pill shadow-sm">New Arrival</span>
        )}
      </div>

      <button
        onClick={handleWishlist}
        className="btn btn-white btn-wishlist position-absolute top-0 end-0 m-3 z-3 rounded-circle shadow-sm border-0 bg-white p-2 transition hover-scale"
      >
        <Heart
          size={18}
          style={{
            fill: isWishlisted ? "#dc3545" : "none",
            color: isWishlisted ? "#dc3545" : "#6c757d",
            transition: "fill 0.2s ease, color 0.2s ease", // Smooth instant transition
          }}
        />
      </button>

      <Link
        to={`/product/${product._id}`}
        className="image-container d-flex align-items-center justify-content-center overflow-hidden bg-white p-4"
        style={{ height: "260px", borderBottom: "1px solid #f8f9fa" }}
      >
        <img
          src={product.image || "https://placehold.co/400x400?text=Eco+Product"}
          alt={product.name}
          className="card-img-top w-100 h-100 object-fit-contain transition-img"
        />
      </Link>

      <div className="card-body p-4 text-start d-flex flex-column justify-content-between">
        <div>
          <p
            className="text-success small fw-bold text-uppercase mb-1"
            style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}
          >
            {product.category || "Sustainable"}
          </p>
          <Link to={`/product/${product._id}`} className="text-decoration-none">
            <h6 className="card-title fw-bold text-dark mb-2 text-truncate-2 line-height-base" title={product.name}>
              {product.name}
            </h6>
          </Link>
        </div>

        <div className="d-flex justify-content-between align-items-end mt-3">
          <div className="d-flex flex-column">
            {product.oldPrice && (
              <small className="text-muted text-decoration-line-through mb-1">₹{product.oldPrice}</small>
            )}
            <span className="h5 fw-bold text-dark mb-0">₹{product.price}</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="btn btn-success rounded-circle p-2 shadow-sm hover-scale border-0 d-flex align-items-center justify-content-center"
            disabled={isOutOfStock || isAddingToCart}
            title="Add to Cart"
            style={{ width: "42px", height: "42px" }}
          >
            {isAddingToCart ? <Loader2 size={20} className="spin-animation" /> : <ShoppingCart size={20} />}
          </button>
        </div>
      </div>

      <style>{`
        .product-card { 
          transition: all 0.4s ease; 
          border: 1px solid #f1f3f5 !important; 
        }
        .product-card:hover { 
          transform: translateY(-8px); 
          box-shadow: 0 20px 40px rgba(0,0,0,0.06) !important; 
          border-color: #e9ecef !important;
        }
        .transition-img { 
          transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1); 
        }
        .product-card:hover .transition-img { 
          transform: scale(1.08); 
        }
        .hover-scale {
          transition: transform 0.2s ease-in-out;
        }
        .hover-scale:hover { 
          transform: scale(1.15); 
        }
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ProductCard;
