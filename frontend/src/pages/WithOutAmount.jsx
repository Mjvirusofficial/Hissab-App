import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getWithoutAmountExpenseById,
  addProductToWithoutAmount,
  deleteProductFromWithoutAmount
} from '../api/allApi';
import { format } from 'date-fns';

// 💡 Lucide Icons for better visual appeal
import { ChevronLeft, Plus, BarChart3, Package, Calendar, TrendingUp, Trash2, Loader2, Clock, ScrollText } from 'lucide-react'; // Added ScrollText for history header

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


function WithoutAmount() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingProduct, setAddingProduct] = useState(false);
  const [productName, setProductName] = useState('');
  const [productAmount, setProductAmount] = useState('');
  const [totalSpent, setTotalSpent] = useState(0);
  const [deletingProductId, setDeletingProductId] = useState(null);


  // --- Utility & State Update Functions ---

  // Centralized function to update expense and total spent
  const updateExpenseState = useCallback((data) => {
    setExpense(data);
    // Calculate total spent
    const spent = data.products?.reduce((sum, p) => sum + p.amount, 0) || 0;
    setTotalSpent(spent);
  }, []);


  // Fetch expense details (The Re-fetch function)
  const fetchExpense = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getWithoutAmountExpenseById(id);

      if (response.success && response.data) {
        updateExpenseState(response.data);
      } else {
        console.error('Failed to fetch expense:', response.message);
        setExpense(null);
      }
    } catch (error) {
      console.error('Error fetching expense:', error);
      setExpense(null);
    } finally {
      setLoading(false);
    }
  }, [id, updateExpenseState]);

  // Initial Fetch
  useEffect(() => {
    fetchExpense();
  }, [fetchExpense]);

  // --- Handlers ---

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!productName.trim() || !productAmount || Number(productAmount) <= 0) {
      alert('Please enter valid item name and amount');
      return;
    }

    try {
      setAddingProduct(true);
      // NOTE: Here we ensure data sent to API is trimemd, but we don't force capitalization 
      // as the backend might expect original input or handle capitalization itself.
      const response = await addProductToWithoutAmount(id, {
        name: productName.trim(),
        amount: Number(productAmount)
      });

      if (response.success) {
        fetchExpense();
        setProductName('');
        setProductAmount('');
      } else {
        alert(response.message || 'Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
    } finally {
      setAddingProduct(false);
    }
  };


  // --- handleDeleteProduct Function ---
  const handleDeleteProduct = useCallback(async (productId) => {
    if (!window.confirm('🗑️ Are you sure you want to delete this item?')) {
      return;
    }

    setDeletingProductId(productId);

    try {
      const response = await deleteProductFromWithoutAmount(id, productId);

      if (response.success) {
        await fetchExpense();
      } else {
        alert(response.message || 'Failed to delete item. Server response error.');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item due to network or server error.');
    } finally {
      setDeletingProductId(null);
    }
  }, [id, fetchExpense]);

  // --- Helper Functions ---

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, hh:mm a');
    } catch (error) {
      console.log(error)
      return 'N/A';
    }
  };

  const getHighestExpense = () => {
    const products = expense?.products || [];
    if (products.length === 0) return '₹0';
    const highest = Math.max(...products.map(p => p.amount));
    return `${RupeeSymbol}${highest.toLocaleString('en-IN')}`;
  };

  const getLastAddedDate = () => {
    const products = expense?.products || [];
    if (products.length === 0) return 'N/A';

    const sortedProducts = [...products].sort((a, b) => new Date(b.date) - new Date(a.date));

    return formatDate(sortedProducts[0]?.date);
  }

  // --- Loading & Error States ---

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center p-8">
          <Loader2 size={36} className="animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Loading expense details...</p>
        </div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex justify-center items-center p-5">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
          <h2 className="text-red-500 text-xl font-bold mb-4">Expense Not Found</h2>
          <p className="text-gray-600 mb-6">The requested expense might not exist or failed to load.</p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center mx-auto text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
          >
            <ChevronLeft size={18} className="mr-1" /> Back to Expense List
          </button>
        </div>
      </div>
    );
  }

  // --- Stats Card Component ---
  const StatsCard = ({ icon: Icon, title, value, bgColor, valueColor }) => (
    <div className={`p-5 rounded-2xl shadow-sm text-center transition-all duration-300 hover:shadow-lg`}
      style={{ backgroundColor: bgColor }}
    >
      <Icon size={24} className="mx-auto mb-2" style={{ color: valueColor }} />
      <p className="text-base font-semibold text-gray-700 mb-1">{title}</p>
      <p className={`text-2xl font-extrabold`} style={{ color: valueColor }}>{value}</p>
    </div>
  );


  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ⬅️ BACK BUTTON */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition"
        >
          <ChevronLeft size={20} className="mr-1" /> Back to Expense List
        </button>

        {/* EXPENSE HEADER & STATS CARD - MINIMAL SHADOW, NO BORDER */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <div className="flex justify-between items-start mb-6 border-b pb-4 border-gray-100">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
                <BarChart3 size={28} className="mr-3 text-indigo-600" />
                {formatProductName(expense.name)}
              </h1>
              <p className="text-gray-500 mt-2 text-sm font-medium">
                Tracker created on {formatDate(expense.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-extrabold text-indigo-600">
                {RupeeSymbol}{totalSpent.toLocaleString('en-IN')}
              </div>
              <p className="text-gray-500 font-medium">Running Total Spent</p>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              icon={Package}
              title="Total Items"
              value={`${expense.products?.length || 0} Items`}
              bgColor="#E6F0FF" // Light Indigo
              valueColor="#4f46e5" // Dark Indigo
            />
            <StatsCard
              icon={Calendar}
              title="Last Added"
              value={getLastAddedDate()}
              bgColor="#E7F7E8" // Light Green
              valueColor="#10b981" // Dark Green
            />
            <StatsCard
              icon={TrendingUp}
              title="Highest Single Expense"
              value={getHighestExpense()}
              bgColor="#FEEFEF" // Light Red/Pink
              valueColor="#ef4444" // Red
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ADD PRODUCT FORM - ONLY GREEN BORDER AND SHADOW KEPT */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-6 border-4 border-green-500 transition-all duration-300 hover:shadow-green-300/60">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 border-green-100 flex items-center">
                <Plus size={24} className="mr-2 text-green-600" /> Add New Expense
              </h2>

              <form onSubmit={handleAddProduct} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g., Dinner, Groceries"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount ({RupeeSymbol})
                  </label>
                  <input
                    type="number"
                    value={productAmount}
                    onChange={(e) => setProductAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={addingProduct}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition text-lg flex items-center justify-center ${addingProduct
                      ? 'bg-green-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-300/60'
                    } text-white`}
                >
                  {addingProduct ? (
                    <span className="flex items-center justify-center">
                      <Loader2 size={20} className="animate-spin mr-2" />
                      Adding...
                    </span>
                  ) : (
                    <><Plus size={20} className="mr-1" /> Add Expense</>
                  )}
                </button>

                <p className="text-gray-500 text-sm text-center pt-2">
                  *Budget-free tracker. Keep adding as you spend.*
                </p>
              </form>
            </div>
          </div>

          {/* EXPENSE HISTORY LIST - HORIZONTAL SCROLL AND BOX LOOK */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6 border-b pb-3 border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <ScrollText size={24} className="mr-2 text-indigo-600" /> Expense History
                </h2>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium border border-indigo-200">
                  {expense.products?.length || 0} items
                </span>
              </div>

              {expense.products?.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Package size={48} className="mx-auto text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No history yet</h3>
                  <p className="mt-1 text-gray-500">Items you add will appear here.</p>
                </div>
              ) : (
                <div className="flex space-x-4 pb-4 overflow-x-auto custom-scrollbar">
                  {/* Added custom-scrollbar class for styling if needed */}

                  {expense.products
                    ?.slice()
                    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Latest first
                    .map((product, index) => {
                      const isDeleting = deletingProductId === product._id;
                      return (
                        <div
                          key={product._id || index}
                          // min-w-[280px] ensures the box width, flex-shrink-0 ensures it scrolls horizontally
                          className={`flex-shrink-0 min-w-[280px] flex flex-col justify-between p-4 bg-indigo-50 rounded-xl border-t-4 border-indigo-500 shadow-lg transition-all duration-300 hover:shadow-indigo-300/50 ${isDeleting ? 'opacity-50' : 'opacity-100'}`}
                        >
                          {/* Item Details */}
                          <div className="flex-1 min-w-0 mb-3">
                            <div className="flex items-center">
                              <Package size={20} className="text-indigo-600 mr-2" />
                              <span className="text-lg font-bold text-gray-900 truncate">
                                {/* 👇 This is where we apply the new formatting function */}
                                {formatProductName(product.name)} 
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {formatDate(product.date)}
                            </p>
                          </div>

                          {/* Amount and Actions */}
                          <div className="flex justify-between items-center pt-2 border-t border-indigo-200">
                            {/* Amount */}
                            <div className="text-left">
                              <p className="text-xs text-gray-500">Amount Spent</p>
                              <div className="text-xl font-extrabold text-indigo-700">
                                {RupeeSymbol}{product.amount.toLocaleString('en-IN')}
                              </div>
                            </div>

                            {/* Actions */}
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              disabled={isDeleting}
                              className={`flex items-center justify-center p-2 rounded-full transition ${isDeleting
                                  ? 'bg-red-300 cursor-wait'
                                  : 'bg-red-100 text-red-600 hover:bg-red-600 hover:text-white'
                                }`}
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
                    })}
                </div>
              )}

              {/* Total Spent Footer - Kept this part separate and full width */}
              <div className="mt-6 pt-4 border-t-2 border-gray-100 bg-white sticky bottom-0">
                <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl shadow-inner border border-indigo-200">
                  <span className="text-lg font-bold text-gray-800">TOTAL SPENT:</span>
                  <span className="text-3xl font-extrabold text-indigo-600">
                    {RupeeSymbol}{totalSpent.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithoutAmount;