import React, { useEffect, useState } from "react";
import { GetWishlistApi, ToggleWishlistApi } from "../../../Redux/service/AllApi";
import ProductCard from "../../../css/components/common/ProductCard";
import { toast } from "react-toastify";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the user's wishlist from the backend
  const fetchWishlist = async () => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");

    if (token) {
      const reqHeader = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const result = await GetWishlistApi(reqHeader);
        if (result && result.status === 200) {
          setWishlistItems(result.data.products || []);
        } else {
          setWishlistItems([]);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Failed to load wishlist");
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    } else {
      // Clear wishlist state if user is logged out
      setWishlistItems([]);
      setLoading(false);
    }
  };

  // Remove an item from the wishlist
  const removeFromWishlist = async (productId) => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) return;

    const reqHeader = { Authorization: `Bearer ${token}` };

    try {
      const result = await ToggleWishlistApi(productId, reqHeader);
      if (result && result.status === 200) {
        toast.success("Removed from wishlist");
        fetchWishlist();
      }
    } catch (err) {
      toast.error("Could not remove item");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="container mt-5" style={{ minHeight: "80vh" }}>
      <h2 className="text-center mb-4">My Wishlist</h2>
      <hr />

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="row">
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item) => (
              <div key={item._id} className="col-md-3 mb-4">
                <ProductCard product={item} wishlistItems={wishlistItems} onRemove={() => removeFromWishlist(item._id)} />
              </div>
            ))
          ) : (
            <div className="text-center mt-5 w-100">
              <h3>Your wishlist is empty</h3>
              <p className="text-muted">Start adding products you love!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
