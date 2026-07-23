import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { toast } from "react-toastify";
import { ToggleWishlistApi } from "../../../Redux/service/AllApi";

function ProductCard({ product, wishlistItems, setWishlistItems }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const isOutOfStock = (product.stock ?? product.quantity) <= 0;

  // Sync Heart color with the wishlist
  useEffect(() => {
    if (wishlistItems) {
      const exists = wishlistItems.some((item) => item._id === product._id);
      setIsWishlisted(exists);
    }
  }, [product._id, wishlistItems]);

  // 🛒 Add to Cart Logic
  const handleAddToCart = (e) => {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      existingItem.qty += 1;
      toast.info("Quantity updated in cart");
    } else {
      cart.push({ ...product, qty: 1 });
      toast.success("Added to cart!");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    // 🟢 ഹെഡറിനെ വിവരമറിയിക്കുന്നു
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ❤️ Wishlist Toggle Logic
  const handleWishlist = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    if (!token) {
      toast.warning("Please login to manage your wishlist");
      return;
    }

    const reqHeader = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const result = await ToggleWishlistApi(product._id, reqHeader);

      if (result.status === 200) {
        // 🟢 Navbar-ന് വേണ്ടി LocalStorage-ലെ Wishlist അപ്‌ഡേറ്റ് ചെയ്യുന്നു
        let currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

        if (!isWishlisted) {
          toast.success("Added to wishlist!");
          setIsWishlisted(true);
          currentWishlist.push(product); // Add to local storage
        } else {
          toast.info("Removed from wishlist");
          setIsWishlisted(false);
          currentWishlist = currentWishlist.filter((item) => item._id !== product._id); // Remove from local storage
        }

        // സേവ് ചെയ്ത ശേഷം ഹെഡറിനെ വിവരമറിയിക്കുന്നു
        localStorage.setItem("wishlist", JSON.stringify(currentWishlist));
        window.dispatchEvent(new Event("wishlistUpdated"));
      }
    } catch (err) {
      console.error("Wishlist Toggle Error", err);
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="card product-card border-0 shadow-sm rounded-4 overflow-hidden position-relative h-100 transition-all bg-white">
      {/* Status Badges */}
      <div className="position-absolute top-0 start-0 m-3 z-3">
        {isOutOfStock ? (
          <span className="badge bg-danger px-3 py-2 rounded-pill shadow-sm">Out of Stock</span>
        ) : (
          product.isNew && <span className="badge bg-success px-3 py-2 rounded-pill shadow-sm">New Arrival</span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="btn btn-white btn-wishlist position-absolute top-0 end-0 m-3 z-3 rounded-circle shadow-sm border-0 bg-white p-2 transition hover-scale"
      >
        <Heart
          size={18}
          style={{
            fill: isWishlisted ? "#dc3545" : "none",
            color: isWishlisted ? "#dc3545" : "#6c757d",
          }}
        />
      </button>

      {/* Clickable Image Container - FIXED IMAGE CROPPING */}
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

      {/* Product Details */}
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

        {/* Price and Cart Button Section */}
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
            disabled={isOutOfStock}
            title="Add to Cart"
            style={{ width: "42px", height: "42px" }}
          >
            <ShoppingCart size={20} />
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
        /* scale(1.08) പകരം ഇമേജ് അധികം zoom ആവാതിരിക്കാൻ scale(1.05) ആക്കി */
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
      `}</style>
    </div>
  );
}

export default ProductCard;
