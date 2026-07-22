import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../../css/components/common/ProductCard";
import { Leaf, ArrowRight, ShieldCheck, Truck, RotateCcw, ShoppingBag, Loader2, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { GetAllProductsApi } from "../../../Redux/service/AllApi";

function HomePage() {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribeEmail, setSubscribeEmail] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await GetAllProductsApi();

        if (result?.status === 200 || result?.status === 201) {
          const products =
            result.data?.allProducts || result.data?.products || (Array.isArray(result.data) ? result.data : []);

          if (Array.isArray(products)) {
            setDbProducts([...products].reverse().slice(0, 8));
          }
        }
      } catch (error) {
        console.error("Home Page Product Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subscribeEmail) {
      toast.warning("Please enter a valid email");
      return;
    }
    toast.success(`Subscribed successfully with ${subscribeEmail}`);
    setSubscribeEmail("");
  };

  // Animation Variants for Scroll Effects
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  return (
    <div className="bg-light-green min-vh-100 overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="position-relative hero-section py-5 d-flex align-items-center" style={{ minHeight: "100vh" }}>
        {/* Animated Background Elements */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="position-absolute bg-success rounded-circle opacity-25 blur-bg"
          style={{ width: "600px", height: "600px", top: "-20%", right: "-10%", filter: "blur(120px)" }}
        />

        <div className="container position-relative z-1">
          <div className="row align-items-center">
            {/* Left Content */}
            <div className="col-lg-6 order-2 order-lg-1 mt-5 mt-lg-0">
              <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="pe-lg-5">
                <motion.div
                  variants={fadeUp}
                  className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill bg-white shadow-sm text-success fw-bold mb-4"
                >
                  <Sparkles size={18} />
                  <span className="small tracking-wide">PREMIUM ORGANIC LIFESTYLE</span>
                </motion.div>

                <motion.h1 variants={fadeUp} className="display-3 fw-black mb-4 text-dark" style={{ lineHeight: "1.2" }}>
                  Elevate Your Life With <br />
                  <span className="text-gradient-success position-relative">Nature's Magic</span>
                </motion.h1>

                <motion.p variants={fadeUp} className="lead text-secondary mb-5 fw-medium pe-lg-4">
                  Experience the purest eco-friendly essentials. Carefully curated for a sustainable planet and a healthier,
                  radiant you.
                </motion.p>

                <motion.div variants={fadeUp} className="d-flex gap-3 flex-wrap">
                  <Link
                    to="/products"
                    className="btn btn-success btn-lg rounded-pill fw-bold px-5 py-3 d-flex align-items-center gap-2 shadow hero-btn"
                  >
                    Explore Collection <ArrowRight size={20} />
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Image */}
            <div className="col-lg-6 order-1 order-lg-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="position-relative p-3"
              >
                {/* Main Hero Image */}
                <div className="image-wrapper rounded-5 shadow-lg overflow-hidden position-relative border border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=80"
                    alt="Eco Lifestyle"
                    className="img-fluid w-100 object-fit-cover hover-zoom"
                    style={{ height: "550px" }}
                  />
                  <div className="overlay-gradient"></div>
                </div>

                {/* Floating Glassmorphism Card */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="position-absolute bottom-0 start-0 glass-card p-4 rounded-4 shadow-lg d-none d-md-flex align-items-center gap-3 ms-n3 mb-4"
                >
                  <div className="bg-success text-white rounded-circle p-3 shadow">
                    <Leaf size={28} />
                  </div>
                  <div>
                    <h5 className="mb-1 fw-black text-dark">100% Organic</h5>
                    <p className="text-muted mb-0 small fw-medium">Certified by Nature</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SCROLLING TRUST BADGES ================= */}
      <div className="container py-5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="row g-4 justify-content-center"
        >
          {[
            { icon: <Truck size={32} />, title: "Free Express Delivery", desc: "On all orders above ₹499" },
            { icon: <ShieldCheck size={32} />, title: "Assured Quality", desc: "Double checked for purity" },
            { icon: <RotateCcw size={32} />, title: "Easy Returns", desc: "No-questions-asked policy" },
          ].map((item, i) => (
            <motion.div variants={fadeUp} className="col-md-4" key={i}>
              <div className="trust-card p-4 rounded-4 bg-white d-flex flex-column align-items-center text-center transition-all h-100">
                <div className="icon-circle mb-3 transition-all d-flex align-items-center justify-content-center">
                  {item.icon}
                </div>
                <h5 className="fw-bold mb-2 text-dark">{item.title}</h5>
                <p className="text-muted mb-0 small">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ================= PRODUCT GRID (SCROLL ANIMATED) ================= */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="row align-items-end mb-5"
          >
            <div className="col-md-8 mb-3 mb-md-0">
              <h2 className="display-5 fw-black text-dark mb-2">Curated For You</h2>
              <p className="text-muted lead mb-0">Our most loved eco-friendly selections</p>
            </div>
            <div className="col-md-4 text-md-end">
              <Link to="/products" className="btn btn-outline-success rounded-pill fw-bold px-4 py-2 hover-arrow">
                View All <ArrowRight size={18} className="ms-1 arrow" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="row g-4"
          >
            {loading ? (
              <div className="text-center py-5 col-12 d-flex flex-column align-items-center">
                <Loader2 size={48} className="animate-spin text-success mb-3" />
                <h5 className="text-muted fw-bold">Fetching Magic...</h5>
              </div>
            ) : dbProducts.length ? (
              dbProducts.map((product, index) => (
                <motion.div variants={fadeUp} className="col-sm-6 col-md-4 col-lg-3" key={product._id || index}>
                  <div className="h-100">
                    <ProductCard product={product} />
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div variants={fadeUp} className="text-center py-5 col-12 bg-light rounded-5 shadow-sm">
                <ShoppingBag size={48} className="text-muted mb-3 opacity-50" />
                <h4 className="fw-bold text-dark">Out of Stock</h4>
                <p className="text-muted">We're bringing fresh items soon.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ================= ANIMATED NEWSLETTER ================= */}
      <section className="container my-5 py-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="newsletter-card position-relative p-5 text-white rounded-5 shadow-lg overflow-hidden"
        >
          {/* Animated Background Gradients */}
          <div className="animated-bg-gradient position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}></div>

          <div className="row align-items-center position-relative z-1 py-4 px-lg-4">
            <div className="col-lg-6 mb-4 mb-lg-0 text-center text-lg-start">
              <h2 className="display-5 fw-black mb-3">
                Join The <br /> Green Revolution
              </h2>
              <p className="lead opacity-90 mb-0">
                Subscribe to get <strong className="text-warning">15% OFF</strong> your first purchase + eco-tips.
              </p>
            </div>

            <div className="col-lg-6">
              <form className="glass-form rounded-pill p-2 d-flex shadow-lg" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  className="form-control border-0 px-4 shadow-none text-white placeholder-light"
                  placeholder="Enter your email address"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="btn btn-light text-success rounded-pill fw-black px-4 py-3 d-flex align-items-center gap-2 hover-scale"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= PREMIUM STYLES ================= */}
      <style>{`
        /* Core Settings */
        .bg-light-green { background-color: #f8fdf9; }
        .fw-black { font-weight: 900; }
        .tracking-wide { letter-spacing: 2px; }
        .transition-all { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        
        /* Typography Gradients */
        .text-gradient-success {
          background: linear-gradient(135deg, #1b5e20, #4caf50);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Buttons & Interactions */
        .hero-btn:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 30px rgba(76, 175, 80, 0.3) !important;
        }
        .hover-arrow:hover .arrow {
          transform: translateX(6px);
          transition: transform 0.3s ease;
        }
        .hover-scale {
          transition: transform 0.3s ease;
        }
        .hover-scale:hover {
          transform: scale(1.05);
        }

        /* Image Effects */
        .hover-zoom {
          transition: transform 0.8s ease;
        }
        .image-wrapper:hover .hover-zoom {
          transform: scale(1.05);
        }
        .overlay-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 40%);
          pointer-events: none;
        }

        /* Glassmorphism Card */
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          z-index: 10;
        }

        /* Trust Cards */
        .trust-card {
          border: 1px solid rgba(0,0,0,0.03);
          box-shadow: 0 10px 30px rgba(0,0,0,0.02);
        }
        .trust-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(27, 94, 32, 0.08);
          border-color: rgba(76, 175, 80, 0.2);
        }
        .icon-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #e8f5e9;
          color: #2e7d32;
        }
        .trust-card:hover .icon-circle {
          background: #2e7d32;
          color: white;
          transform: scale(1.1) rotate(5deg);
        }

        /* Newsletter Section */
        .animated-bg-gradient {
          background: linear-gradient(-45deg, #0f3e14, #1b5e20, #2e7d32, #1b5e20);
          background-size: 400% 400%;
          animation: gradientBG 10s ease infinite;
        }
        .glass-form {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .glass-form input {
          background: transparent !important;
          color: white !important;
        }
        .placeholder-light::placeholder {
          color: rgba(255, 255, 255, 0.7) !important;
        }

        /* Animations */
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Responsive Fixes */
        @media (max-width: 768px) {
          .glass-card { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}

export default HomePage;
