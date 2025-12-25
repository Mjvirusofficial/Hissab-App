import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  getExpenseById,
  addProduct,
  deleteProduct,
  isAuthenticated
} from "../api/allApi";

// 💡 Lucide Icons
import { ChevronLeft, Plus, Trash2, Loader2, BarChart3, Calendar, Tag, AlertTriangle, CheckCircle, Package } from 'lucide-react';

// Indian Rupee Symbol for display
const RupeeSymbol = "₹";

// --- New Utility Function: Capitalize the first letter of each word ---
const formatProductName = (name) => {
  if (!name) return '';
  // Split the name by space, map over each word, capitalize the first letter, and rejoin.
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
// ------------------------------------------------------------------------

// Utility function for formatting date
const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return 'N/A';
  }
};

function WithAmount() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingProduct, setAddingProduct] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deletingProductId, setDeletingProductId] = useState(null); // State for delete loading

  // Check auth (Original Logic Retained)
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch expense data (Original Logic Retained)
  useEffect(() => {
    fetchExpense();
  }, [id]);

  const fetchExpense = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getExpenseById(id);

      if (response.success) {
        setExpense(response.data);
      } else {
        setError("Expense not found or API failed.");
      }
    } catch (err) {
      setError(err.message || "Failed to load expense");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (data) => {
    try {
      setAddingProduct(true);
      setError("");
      setSuccessMessage("");

      const response = await addProduct(id, {
        name: data.productName,
        amount: Number(data.productAmount),
        date: data.productDate || new Date().toISOString().split('T')[0]
      });

      if (response.success) {
        setSuccessMessage("Expense item added successfully!");
        reset();
        fetchExpense(); // Refresh data
        setTimeout(() => setSuccessMessage(""), 3000); // Clear success message
      } else {
        setError(response.message || "Failed to add product.");
      }
    } catch (err) {
      setError(err.message || "Failed to add product");
    } finally {
      setAddingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("🗑️ Are you sure you want to delete this expense item?")) {
      return;
    }

    setDeletingProductId(productId); // Set loading state for this specific product

    try {
      setSuccessMessage("");
      setError("");

      const response = await deleteProduct(id, productId);

      if (response.success) {
        setSuccessMessage("Expense item deleted successfully!");
        fetchExpense(); // Refresh data
        setTimeout(() => setSuccessMessage(""), 3000); // Clear success message
      } else {
        setError(response.message || "Failed to delete item.");
      }
    } catch (err) {
      setError(err.message || "Failed to delete product");
    } finally {
      setDeletingProductId(null); // Clear loading state
    }
  };

  // --- LOADING / ERROR STATES ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 size={30} className="animate-spin text-indigo-600" />
          <p className="mt-4 text-gray-600">Loading expense details...</p>
        </div>
      </div>
    );
  }

  if (error && !expense) {
    return (
      <div className="p-10 text-center bg-white rounded-xl shadow-lg m-10">
        <AlertTriangle size={30} className="inline text-red-500 mb-3" />
        <p className="text-red-600 font-semibold text-xl">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 flex items-center justify-center mx-auto"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Home
        </button>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="p-10 text-center bg-white rounded-xl shadow-lg m-10">
        <p className="text-red-600 font-semibold text-xl">Expense not found</p>
      </div>
    );
  }

  // --- CALCULATIONS ---
  const totalSpent = expense.products?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const remaining = expense.totalAmount - totalSpent;
  const isOverBudget = remaining < 0;

  // --- STATS CARD COMPONENT (Inner cards keep their light color scheme) ---
  const StatsCard = ({ title, value, bgColor, valueColor }) => (
    <div
      // This is the individual stat card, not the main container
      className={`flex-1 p-5 rounded-xl shadow-lg text-center 
                  border border-indigo-300 transition-all duration-300 
                  hover:shadow-xl hover:shadow-indigo-300/50 hover:scale-[1.02]`}
      style={{ backgroundColor: bgColor }}
    >
      <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
        {title}
      </h2>
      <p className={`text-2xl md:text-3xl font-extrabold`} style={{ color: valueColor }}>
        {RupeeSymbol}{Math.abs(value).toLocaleString('en-IN')}
      </p>
      {(title === 'Remaining' && isOverBudget) && <span className="text-xs font-normal block text-red-600 mt-1">(Overspent)</span>}
    </div>
  );


  // --- PRODUCT LIST CARD COMPONENT for Horizontal Scroll (MODIFIED) ---
  const ProductCard = ({ p, handleDelete }) => {
    const isDeleting = deletingProductId === (p._id || p.id);
    return (
      <div
        key={p._id || p.id}
        className={`min-w-[280px] w-[280px] p-4 bg-indigo-50 rounded-xl shadow-lg border-t-4 border-indigo-500 flex flex-col justify-between flex-shrink-0 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-300/50 ${isDeleting ? 'opacity-50' : 'opacity-100'}`}
      >
        <div className="space-y-2">
          {/* Amount */}
          <div className="font-extrabold text-3xl text-indigo-700">
            {RupeeSymbol}{Number(p.amount).toLocaleString('en-IN')}
          </div>
          
          {/* Name - Applied Capitalization here */}
          <p className="font-bold text-lg text-gray-900 flex items-center">
            <Package size={18} className="mr-2 text-indigo-600" />
            {formatProductName(p.name)} {/* <-- Applied formatProductName */}
          </p>
          
          {/* Date */}
          <p className="text-sm text-gray-500 flex items-center">
            <Calendar size={12} className="mr-1" />
            <span className="font-medium">{formatDate(p.date)}</span>
          </p>
        </div>

        {/* Delete Button (Modified for smaller, cleaner look) */}
        <div className="mt-4 pt-3 border-t border-indigo-200 flex justify-end">
          <button
            onClick={() => handleDelete(p._id || p.id)}
            disabled={isDeleting}
            className={`flex items-center justify-center p-2 rounded-full transition ${
              isDeleting 
              ? 'bg-red-300 cursor-wait' 
              : 'bg-red-100 text-red-600 hover:bg-red-600 hover:text-white'
            }`}
            title="Delete Item"
          >
            {isDeleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ⬅️ BACK BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" /> Back to Expense List
        </button>

        {/* STATS SECTION (Back to previous style: bg-white, shadow-xl, border-gray-100) */}
        <div 
          className="bg-white p-6 shadow-xl rounded-3xl border border-gray-100"
        >

          {/* Expense Name */}
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4 border-b pb-4 border-gray-100">
            <BarChart3 size={28} className="inline mr-3 text-indigo-600" />
            {formatProductName(expense.name) || "Expense Details"}
          </h1>

          {/* RESPONSIVE STATS CONTAINER: grid-cols-3 */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">

            {/* Total Amount (Light Theme Retained) */}
            <StatsCard
              title="Total Amount"
              value={expense.totalAmount}
              bgColor="#E6F0FF" // Light Blue/Indigo Background
              valueColor="#4f46e5" // Indigo Text
            />

            {/* Remaining (Light Theme Retained) */}
            <StatsCard
              title="Remaining"
              value={remaining}
              bgColor="#E7F7E8" // Light Green Background
              valueColor={isOverBudget ? "#dc2626" : "#10b981"} // Red if overspent, Green otherwise
            />

            {/* Spent (Light Theme Retained) */}
            <StatsCard
              title="Spent"
              value={totalSpent}
              bgColor="#FEEFEF" // Light Red/Pink Background
              valueColor="#ef4444" // Red Text
            />
          </div>
        </div>

        {/* --- MESSAGES --- */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center shadow-md">
            <AlertTriangle size={20} className="mr-2" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center shadow-md">
            <CheckCircle size={20} className="mr-2" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* ADD PRODUCT FORM - ASHOKA CHAKRA BLUE BORDER (This is the only section with a colored border) */}
        <div 
          // Retained bg-white, shadow-xl, and added border-4 border-indigo-500
          className="bg-white p-6 shadow-xl rounded-3xl border-4 border-indigo-500 transition-all duration-300 hover:shadow-indigo-200"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3 border-indigo-100">
            <Plus size={24} className="inline mr-2 text-indigo-600" /> Add New Expense
          </h2>
          <form onSubmit={handleSubmit(handleAddProduct)} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

            {/* Product Name */}
            <div className="md:col-span-1">
              <label className="text-sm font-medium text-gray-600 flex items-center mb-1">
                <Tag size={14} className="mr-1 text-indigo-500" /> Product Name
              </label>
              <input
                type="text"
                placeholder="Product Name"
                {...register("productName", { required: true })}
                className="w-full border border-gray-300 p-3 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-colors"
              />
            </div>

            {/* Amount */}
            <div className="md:col-span-1">
              <label className="text-sm font-medium text-gray-600 flex items-center mb-1">
                Amount ({RupeeSymbol})
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                {...register("productAmount", { required: true, min: 0 })}
                className="w-full border border-gray-300 p-3 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-colors"
              />
            </div>

            {/* Date */}
            <div className="md:col-span-1">
              <label className="text-sm font-medium text-gray-600 flex items-center mb-1">
                <Calendar size={14} className="mr-1 text-indigo-500" /> Date
              </label>
              <input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                {...register("productDate", { required: true })}
                className="w-full border border-gray-300 p-3 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-1">
              <button
                type="submit"
                disabled={addingProduct}
                className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center ${addingProduct
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-300"
                  } text-white`}
              >
                {addingProduct ? (
                  <Loader2 size={20} className="animate-spin mr-2" />
                ) : (
                  <Plus size={20} className="mr-1" />
                )}
                {addingProduct ? "Adding..." : "Add Expense"}
              </button>
            </div>
          </form>
        </div>

        {/* PRODUCT LIST (Back to previous style: bg-white, shadow-xl, border-gray-100) */}
        <div 
          className="bg-white p-6 shadow-xl rounded-3xl border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3 border-gray-100 flex items-center">
            <BarChart3 size={24} className="mr-2 text-indigo-600" /> Expense History ({expense.products?.length || 0})
          </h2>

          {!expense.products || expense.products.length === 0 ? (
            <div className="p-4 text-center bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-500 font-medium">No items logged for this expense yet. Start tracking!</p>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4 -mx-2">
              <div className="flex space-x-4 min-w-max px-2">
                {/* Show latest item first */}
                {expense.products.slice().reverse().map((p) => (
                  <ProductCard
                    key={p._id || p.id}
                    p={p}
                    handleDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WithAmount;