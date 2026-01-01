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
import { ChevronLeft, Plus, Trash2, Loader2, BarChart3, Calendar, Tag, AlertTriangle, CheckCircle, Package, Printer } from 'lucide-react';

const RupeeSymbol = "₹";

const formatProductName = (name) => {
  if (!name) return '';
  return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return 'N/A'; }
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
  const [deletingProductId, setDeletingProductId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) { navigate("/login"); }
  }, [navigate]);

  useEffect(() => {
    fetchExpense();
  }, [id]);

  const fetchExpense = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getExpenseById(id);
      if (response.success) { setExpense(response.data); }
      else { setError("Expense not found or API failed."); }
    } catch (err) { setError(err.message || "Failed to load expense"); }
    finally { setLoading(false); }
  };

  const handlePrint = () => {
    window.print();
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
        fetchExpense();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else { setError(response.message || "Failed to add product."); }
    } catch (err) { setError(err.message || "Failed to add product"); }
    finally { setAddingProduct(false); }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("🗑️ Are you sure you want to delete this expense item?")) { return; }
    setDeletingProductId(productId);
    try {
      setSuccessMessage("");
      setError("");
      const response = await deleteProduct(id, productId);
      if (response.success) {
        setSuccessMessage("Expense item deleted successfully!");
        fetchExpense();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else { setError(response.message || "Failed to delete item."); }
    } catch (err) { setError(err.message || "Failed to delete product"); }
    finally { setDeletingProductId(null); }
  };

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

  const totalSpent = expense.products?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const remaining = expense.totalAmount - totalSpent;
  const isOverBudget = remaining < 0;

  const StatsCard = ({ title, value, bgColor, valueColor }) => (
    <div
      className="flex-1 p-2 md:p-5 rounded-xl shadow-lg text-center border border-indigo-300"
      style={{ backgroundColor: bgColor }}
    >
      <h2 className="text-[10px] md:text-lg font-semibold text-gray-800 mb-1 leading-tight">
        {title}
      </h2>
      <p className="text-xs md:text-3xl font-extrabold truncate" style={{ color: valueColor }}>
        {RupeeSymbol}{Math.abs(value).toLocaleString('en-IN')}
      </p>
      {(title === 'Remaining' && isOverBudget) && <span className="text-[8px] md:text-xs font-normal block text-red-600 mt-1">(Over)</span>}
    </div>
  );

  const ProductCard = ({ p, handleDelete }) => {
    const isDeleting = deletingProductId === (p._id || p.id);
    return (
      <div
        key={p._id || p.id}
        className={`min-w-[160px] md:min-w-[280px] p-3 md:p-4 bg-indigo-50 rounded-xl shadow-lg border-t-4 border-indigo-500 flex flex-col justify-between flex-shrink-0 transition-all ${isDeleting ? 'opacity-50' : 'opacity-100'}`}
      >
        <div className="space-y-1 md:space-y-2">
          <div className="font-extrabold text-xl md:text-3xl text-indigo-700">
            {RupeeSymbol}{Number(p.amount).toLocaleString('en-IN')}
          </div>
          <p className="font-bold text-xs md:text-lg text-gray-900 flex items-center truncate">
            <Package size={14} className="mr-1 text-indigo-600 md:w-[18px] md:h-[18px]" /> 
            {formatProductName(p.name)}
          </p>
          <p className="text-[10px] md:text-sm text-gray-500 flex items-center">
            <Calendar size={10} className="mr-1 md:w-[12px] md:h-[12px]" /> 
            <span className="font-medium">{formatDate(p.date)}</span>
          </p>
        </div>
        <div className="mt-3 md:mt-4 pt-2 border-t border-indigo-200 flex justify-end">
          <button onClick={() => handleDelete(p._id || p.id)} disabled={isDeleting} className="p-1.5 md:p-2 rounded-full bg-red-100 text-red-600">
            {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} className="md:w-4 md:h-4" />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <style>{`@media print { .no-print { display: none !important; } }`}</style>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center no-print">
          <button onClick={() => navigate("/")} className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors">
            <ChevronLeft size={20} className="mr-1" /> Back
          </button>
          <button onClick={handlePrint} className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-800 transition-all">
            <Printer size={16} /> Print Report
          </button>
        </div>

        {/* DASHBOARD */}
        <div className="bg-white p-4 md:p-6 shadow-xl rounded-3xl border border-gray-100">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-4 border-b pb-4 border-gray-100">
            <BarChart3 size={28} className="inline mr-3 text-indigo-600" />
            {formatProductName(expense.name) || "Expense Details"}
          </h1>

          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <StatsCard title="Total Amount" value={expense.totalAmount} bgColor="#E6F0FF" valueColor="#4f46e5" />
            <StatsCard title="Remaining" value={remaining} bgColor="#E7F7E8" valueColor={isOverBudget ? "#dc2626" : "#10b981"} />
            <StatsCard title="Spent" value={totalSpent} bgColor="#FEEFEF" valueColor="#ef4444" />
          </div>
        </div>

        {/* ADD PRODUCT FORM (Responsive Text & Layout) */}
        <div className="bg-white p-4 md:p-6 shadow-xl rounded-3xl border-4 border-indigo-500 no-print">
          <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-4 md:mb-5 border-b pb-3 border-indigo-100">
            <Plus size={20} className="inline mr-2 text-indigo-600 md:w-6 md:h-6" /> Add New Expense
          </h2>
          <form onSubmit={handleSubmit(handleAddProduct)} className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-end">
            <div className="md:col-span-1">
              <label className="text-[10px] md:text-sm font-medium text-gray-600 mb-1 block">Product Name</label>
              <input type="text" placeholder="Name" {...register("productName", { required: true })} className="w-full border border-gray-300 p-2 md:p-3 rounded-xl text-sm" />
            </div>
            <div className="md:col-span-1">
              <label className="text-[10px] md:text-sm font-medium text-gray-600 mb-1 block">Amount</label>
              <input type="number" step="0.01" placeholder="0" {...register("productAmount", { required: true, min: 0 })} className="w-full border border-gray-300 p-2 md:p-3 rounded-xl text-sm" />
            </div>
            <div className="md:col-span-1">
              <label className="text-[10px] md:text-sm font-medium text-gray-600 mb-1 block">Date</label>
              <input type="date" defaultValue={new Date().toISOString().split('T')[0]} {...register("productDate", { required: true })} className="w-full border border-gray-300 p-2 md:p-3 rounded-xl text-sm" />
            </div>
            <div className="md:col-span-1">
              <button type="submit" disabled={addingProduct} className="w-full py-2.5 md:py-3 rounded-xl font-semibold bg-indigo-600 text-white text-sm transition-all hover:bg-indigo-700 active:scale-95">
                {addingProduct ? "..." : "Add Expense"}
              </button>
            </div>
          </form>
        </div>

        {/* HISTORY SECTION */}
        <div className="bg-white p-5 md:p-6 shadow-xl rounded-3xl border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-5 border-b pb-3 border-gray-100 flex items-center">
            <BarChart3 size={24} className="mr-2 text-indigo-600" /> History ({expense.products?.length || 0})
          </h2>
          {!expense.products || expense.products.length === 0 ? (
            <div className="p-4 text-center bg-gray-50 rounded-xl"><p className="text-gray-500">No items logged yet.</p></div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-3 px-1">
                {expense.products.slice().reverse().map((p) => ( <ProductCard key={p._id || p.id} p={p} handleDelete={handleDeleteProduct} /> ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WithAmount;