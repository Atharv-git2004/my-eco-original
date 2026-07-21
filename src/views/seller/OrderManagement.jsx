import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { User, Phone, MapPin, Package, Eye, ShoppingBag, Truck, CheckCircle } from 'lucide-react';
// Importing UpdateOrderStatusApi as well
import { GetSellerOrdersApi, UpdateOrderStatusApi } from '../Redux/service/AllApi'; 

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Retrieving data from session storage
  const userData = JSON.parse(sessionStorage.getItem('user'));

  const fetchOrders = async () => {
    const token = sessionStorage.getItem('token');
    
    // Ensuring token and seller role exist
    if (userData && userData.role?.toLowerCase() === 'seller' && token) {
      try {
        const header = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };
        
        const result = await GetSellerOrdersApi(header);
        
        if (result && (result.status === 200 || result.status === 201)) {
          setOrders(result.data);
        } else {
          setOrders([]);
          console.error("API Error Status:", result.status);
        }
      } catch (error) {
        console.error("Orders fetch error:", error);
        toast.error("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  // ✅ Function to update status (Shipped / Delivered)
  const handleStatusUpdate = async (orderId, newStatus) => {
    const token = sessionStorage.getItem('token');
    const header = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };

    try {
      // API call
      const result = await UpdateOrderStatusApi(orderId, { status: newStatus }, header);
      
      if (result.status === 200 || result.status === 201) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders(); // Refreshing the list
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error("Failed to update status.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Access Control
  if (!userData || userData.role?.toLowerCase() !== 'seller') {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <div className="card shadow p-5 text-center border-0 rounded-4">
          <h2 className="fw-bold text-dark">Access Denied</h2>
          <p className="text-muted">Only sellers are authorized to view this page.</p>
          <button onClick={() => window.location.href='/login'} className="btn btn-success px-5 py-2 mt-3 rounded-pill">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4 text-start" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0 d-flex align-items-center gap-2">
          <Package className="text-success" /> Order Management
        </h3>
        <div className="d-flex gap-2">
           <button onClick={fetchOrders} className="btn btn-outline-success btn-sm rounded-pill px-3">Refresh</button>
           <span className="badge bg-success px-3 py-2 rounded-pill shadow-sm">
             Total Orders: {orders?.length || 0}
           </span>
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
        {loading ? (
          <div className="text-center p-5">
            <div className="spinner-border text-success" role="status"></div>
            <p className="mt-2 text-muted">Loading orders...</p>
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center p-5">
            <ShoppingBag size={48} className="text-muted mb-3" />
            <p className="text-muted fs-5">No orders found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light text-uppercase small fw-bold">
                <tr>
                  <th className="ps-4 py-3">Order ID</th>
                  <th>Customer Details</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Current Status</th>
                  <th className="text-center">Set Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="ps-4 fw-bold text-primary">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td>
                      {order.shippingAddress ? (
                        <div className="d-flex flex-column py-2">
                          <span className="fw-bold text-dark d-flex align-items-center gap-1">
                            <User size={14} className="text-success"/> {order.shippingAddress.name}
                          </span>
                          <span className="text-muted small d-flex align-items-center gap-1">
                            <Phone size={14}/> {order.shippingAddress.phone}
                          </span>
                          <div className="text-muted small mt-1 d-flex align-items-start gap-1" style={{ maxWidth: '200px' }}>
                            <MapPin size={14} className="text-danger mt-1" />
                            <span className="text-truncate">
                              {order.shippingAddress.city}, {order.shippingAddress.pincode}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-danger small italic">Address Not Found</span>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-secondary rounded-pill px-2">
                        {order.orderItems?.length || 0} Items
                      </span>
                    </td>
                    <td className="fw-bold text-dark">₹{Number(order.totalPrice || 0).toLocaleString()}</td>
                    <td>
                      <span className={`badge px-3 py-2 rounded-pill ${
                        order.status === 'Delivered' ? 'bg-success' : 
                        order.status === 'Cancelled' ? 'bg-danger' : 
                        order.status === 'Shipped' ? 'bg-info' : 'bg-warning text-dark'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        {/* Shipped Button */}
                        <button 
                          disabled={order.status === 'Shipped' || order.status === 'Delivered'}
                          onClick={() => handleStatusUpdate(order._id, 'Shipped')}
                          className="btn btn-outline-info btn-sm rounded-circle p-2"
                          title="Mark as Shipped"
                        >
                          <Truck size={16} />
                        </button>
                        {/* Delivered Button */}
                        <button 
                          disabled={order.status === 'Delivered'}
                          onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                          className="btn btn-outline-success btn-sm rounded-circle p-2"
                          title="Mark as Delivered"
                        >
                          <CheckCircle size={16} />
                        </button>
                        {/* View Details */}
                        <button 
                          className="btn btn-light btn-sm rounded-circle shadow-sm border p-2"
                          onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                        >
                          <Eye size={16} className="text-success" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- 📦 DETAILS MODAL --- */}
      {showModal && selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 bg-light rounded-top-4 p-4">
                <h5 className="fw-bold text-success m-0 d-flex align-items-center gap-2">
                  <Package size={22}/> Order Details #{selectedOrder._id.slice(-6).toUpperCase()}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-4 text-start">
                  <div className="col-md-5 border-end">
                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                      <MapPin size={18} className="text-danger"/> Shipping Address
                    </h6>
                    <div className="bg-light p-3 rounded-3 shadow-sm border">
                      <p className="fw-bold mb-1 fs-6 text-dark">{selectedOrder.shippingAddress?.name}</p>
                      <p className="mb-1 text-muted">{selectedOrder.shippingAddress?.house}</p>
                      <p className="mb-1 text-muted">{selectedOrder.shippingAddress?.city} - {selectedOrder.shippingAddress?.pincode}</p>
                      <div className="mt-3 pt-2 border-top">
                        <p className="fw-bold mb-0 text-primary">
                          <Phone size={16} className="me-1"/> {selectedOrder.shippingAddress?.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-7">
                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                      <ShoppingBag size={18} className="text-primary"/> Order Summary
                    </h6>
                    <div className="pe-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {selectedOrder.orderItems?.map((item, idx) => (
                        <div key={idx} className="d-flex align-items-center gap-3 mb-3 pb-2 border-bottom">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="rounded shadow-sm border" 
                            style={{ width: '55px', height: '55px', objectFit: 'cover' }} 
                          />
                          <div className="flex-grow-1">
                            <p className="small fw-bold mb-0">{item.name}</p>
                            <small className="text-muted">Qty: {item.qty} × ₹{item.price}</small>
                          </div>
                          <span className="fw-bold text-success">₹{(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="d-flex justify-content-between mt-3 bg-success bg-opacity-10 p-3 rounded-3 border border-success border-opacity-25">
                      <span className="fw-bold text-dark">Grand Total:</span>
                      <span className="fw-bold text-success fs-5">₹{Number(selectedOrder.totalPrice || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button className="btn btn-secondary rounded-pill px-5 fw-bold" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;