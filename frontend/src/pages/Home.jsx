import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
// 💡 Lucide Icons for Modern UI (Assumed available)
import { TrendingUp, FileText, Plus, Trash2, Eye, Loader2, DollarSign, Calendar, Package, Zap } from 'lucide-react';
// 💡 Your Original API Imports
import {
  createExpense,
  getAllExpenses,
  deleteExpense,
  createWithoutAmountExpense,
  getAllWithoutAmountExpenses,
  deleteWithoutAmountExpense
} from "../api/allApi";

// --- CUSTOM IMAGES IMPORT ---
// 1. Budgeted Expense Image (Your existing import)
import img1 from '../assets/imgv2.mp4'
// 2. Free Log Image (NEW IMPORT - आपको यह इमेज अपने assets फोल्डर में जोड़नी होगी)
import img2 from '../assets/imgv.mp4' // <-- Replace with your actual path!


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


function Home() {
  // --- STATE AND HOOKS (Original Logic) ---
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [withoutAmountExpenses, setWithoutAmountExpenses] = useState([]);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);
  const [isLoadingWithoutAmount, setIsLoadingWithoutAmount] = useState(true);
  const [activeTab, setActiveTab] = useState("withAmount"); // UI State

  // --- API Fetch Functions (Original Logic Retained) ---

  const fetchExpenses = async () => {
    setIsLoadingExpenses(true);
    console.log("🚀 Fetching budgeted expenses...");
    try {
      const response = await getAllExpenses();
      console.log("📦 Budgeted API Result:", response);

      if (response && response.success && Array.isArray(response.data)) {
        setExpenses(response.data);
      } else {
        console.warn("⚠️ Budgeted data not valid or API error message:", response?.message);
        setExpenses([]);
      }
    } catch (error) {
      console.error("❌ Error fetching budgeted expenses:", error.message || error);
      setExpenses([]);
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  const fetchWithoutAmountExpenses = async () => {
    setIsLoadingWithoutAmount(true);
    console.log("🚀 Fetching without amount expenses...");

    try {
      const result = await getAllWithoutAmountExpenses();
      console.log("📦 API Result:", result);

      if (result && result.success && Array.isArray(result.data)) {
        console.log("✅ Data found:", result.data);
        setWithoutAmountExpenses(result.data);
      } else {
        console.warn("⚠️ No valid data or success: false");
        setWithoutAmountExpenses([]);
      }

    } catch (err) {
      console.error("❌ Fetch error:", err.message || err);
      setWithoutAmountExpenses([]);
    } finally {
      setIsLoadingWithoutAmount(false);
    }
  };

  // --- API Create Functions (Original Logic Retained) ---

  const onSubmitWithAmount = async (data) => {
    setLoading(true);
    try {
      console.log("🚀 Creating budgeted expense with data:", data);

      const response = await createExpense({
        // Name is capitalized upon display, not creation (API should handle saving the raw input)
        name: data.name, 
        totalAmount: Number(data.amount),
      });

      console.log("✅ Budgeted creation response:", response);

      if (response && response.success) {
        const newId = response.data?._id || response.data?.id;
        if (newId) {
          reset();
          await fetchExpenses();
          navigate(`/with-ammount/${newId}`);
        } else {
          alert("Created successfully, but no ID received for navigation.");
          await fetchExpenses();
        }
      } else {
        alert(`❌ Failed to create budget: ${response?.message || 'Server error'}`);
      }
    } catch (error) {
      console.error("❌ Error creating budgeted expense:", error.message || error);
      alert("❌ Creation failed. Check console or network tab for detailed error.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitWithoutAmount = async (data) => {
    setLoading(true);
    try {
      console.log("🚀 Creating free expense log with data:", data);

      const response = await createWithoutAmountExpense({
        // Name is capitalized upon display, not creation
        name: data.name,
      });

      console.log("✅ Free Log creation response:", response);

      if (response && response.success) {
        const newId = response.data?._id || response.data?.id;
        if (newId) {
          reset();
          await fetchWithoutAmountExpenses();
          navigate(`/without-amount/${newId}`);
        } else {
          alert("Created successfully, but no ID received for navigation.");
          await fetchWithoutAmountExpenses();
        }
      } else {
        alert(`❌ Failed to create free log: ${response?.message || 'Server error'}`);
      }
    } catch (error) {
      console.error("❌ Error creating free expense log:", error.message || error);
      alert("❌ Creation failed. Check console or network tab for detailed error.");
    } finally {
      setLoading(false);
    }
  };

  // --- API Delete Functions (Original Logic Retained) ---

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm("🗑️ Delete this expense?")) return;
    try {
      const response = await deleteExpense(expenseId);
      if (response && response.success) {
        setExpenses(expenses.filter(e => e._id !== expenseId));
        alert("✅ Expense deleted successfully!");
      } else {
        alert(`❌ Failed to delete: ${response?.message || 'Server error'}`);
      }
    } catch (error) {
      console.error("❌ Error deleting budgeted expense:", error);
      alert("❌ Failed to delete. Check console.");
    }
  };

  const handleDeleteWithoutAmountExpense = async (expenseId) => {
    if (!window.confirm("🗑️ Delete this expense?")) return;
    try {
      const response = await deleteWithoutAmountExpense(expenseId);
      if (response && response.success) {
        setWithoutAmountExpenses(withoutAmountExpenses.filter(e => e._id !== expenseId));
        alert("✅ Expense deleted successfully!");
      } else {
        alert(`❌ Failed to delete: ${response?.message || 'Server error'}`);
      }
    } catch (error) {
      console.error("❌ Error deleting free log:", error);
      alert("❌ Failed to delete. Check console.");
    }
  };


  // --- UTILITIES (Original Logic Retained) ---
  useEffect(() => {
    fetchExpenses();
    fetchWithoutAmountExpenses();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const calculateTotalSpent = (expense) => {
    // Use pre-calculated totalSpent if available
    if (expense.totalSpent !== undefined && expense.totalSpent !== null) return expense.totalSpent;

    // Fallback to calculation from products array
    return expense.products?.reduce((total, product) => total + (product.amount || 0), 0) || 0;
  };


  // ----------------------------------------------------------------------------------
  // 🎨 UI COMPONENTS (Lime/Indigo Theme - UI Lock)
  // ----------------------------------------------------------------------------------

  const TabButton = ({ tab, icon: Icon, colorClass, text }) => (
    <button
      className={`flex items-center px-6 py-3 text-lg font-semibold rounded-2xl transition-all duration-300 ${activeTab === tab
        ? `bg-white text-gray-800 shadow-xl ring-4 ${colorClass}`
        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
        }`}
      onClick={() => setActiveTab(tab)}
    >
      <Icon size={20} className={`mr-2 ${activeTab === tab ? colorClass.replace('ring-4 ', 'text-').replace('ring-', 'text-') : ''}`} />
      {text}
    </button>
  );

  const FormContainer = ({ children, isLeft, color, imageSrc }) => (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16`}>

      {/* 2. Form (Mobile First Order: Order-1) */}
      <div className={`
        ${isLeft ? 'md:order-1' : 'md:order-2'} /* Desktop Ordering */
        order-1 /* Mobile Ordering: Form first */
        w-full 
        flex ${isLeft ? 'md:justify-start' : 'md:justify-end'} justify-center 
      `}>
        <div className={`
          max-w-lg w-full 
          bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-2xl border-t-4 border-${color}-500 
          transform transition-all duration-500
        `}>
          {children}
        </div>
      </div>

      {/* 1. Image Placeholder (Mobile First Order: Order-2) */}
      <div className={`
        ${isLeft ? 'md:order-2' : 'md:order-1'} /* Desktop Ordering */
        order-2 /* Mobile Ordering: Image second */
        flex items-center justify-center 
        w-full h-full min-h-[300px]
      `}>
        <div className="text-center p-6 w-full h-full flex items-center justify-center bg-white rounded-3xl shadow-lg border border-gray-100">
          <video
            key={activeTab}   // 🔥 tab change hote hi video reload hoga
            src={activeTab === "withAmount" ? img1 : img2}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain max-h-[350px]"
          >
            Your browser does not support the video tag.
          </video>


        </div>
      </div>

    </div>
  );

  const HistoryCard = ({ expense, isBudgeted, handleDelete, navigateTo }) => {
    // Indigo for Budgeted (Blue), Lime for Free Log (Requested Bright Green)
    const color = isBudgeted ? 'indigo' : 'lime';
    const spent = calculateTotalSpent(expense);
    const productsCount = expense.products?.length || 0;

    const cardBorder = isBudgeted ? 'border-indigo-500' : 'border-lime-500';
    const textColor = isBudgeted ? 'text-indigo-600' : 'text-lime-700';
    const buttonClass = isBudgeted
      ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-300 text-white"
      : "bg-lime-500 hover:bg-lime-600 shadow-lime-300 text-white"; // Lime Button with White Text

    return (
      <div
        className={`bg-white rounded-2xl shadow-lg p-5 border-l-4 ${cardBorder} hover:shadow-xl transition-all duration-300 min-w-[300px] w-[300px] flex-shrink-0`}
      >
        <div className="flex justify-between items-start mb-3">
          {/* APPLYING CAPITALIZATION HERE */}
          <h4 className="text-lg font-bold text-gray-800 truncate">
            {formatProductName(expense.name) || 'Untitled Log'} 
          </h4>
          
          <button
            onClick={() => handleDelete(expense._id)}
            className="text-red-500 hover:text-white p-1 bg-red-100 hover:bg-red-600 rounded-full transition ml-2"
            title="Delete expense"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="space-y-3 pt-2 border-t border-gray-100">
          {isBudgeted && (
            <div className="flex justify-between items-center text-sm">
              <span className={`font-semibold text-indigo-600 flex items-center`}><DollarSign size={16} className="mr-1" /> Budget:</span>
              <span className={`font-extrabold text-indigo-700`}>{RupeeSymbol}{(expense.totalAmount || 0).toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm">
            <span className={`font-semibold ${textColor} flex items-center`}>
              <DollarSign size={16} className="mr-1" /> Spent:
            </span>
            <span className={`font-extrabold ${isBudgeted ? 'text-indigo-700' : 'text-lime-600'}`}>
              {RupeeSymbol}{spent.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="flex items-center"><Package size={16} className="mr-1" /> Items:</span>
            <span>{productsCount}</span>
          </div>
          <div className="text-xs text-gray-500 text-right flex items-center justify-end">
            <Calendar size={12} className="mr-1" /> Created: {formatDate(expense.createdAt)}
          </div>

          <button
            onClick={() => navigate(navigateTo)}
            className={`w-full ${buttonClass} py-2 rounded-lg font-medium transition-all text-sm mt-2 shadow-md`}
          >
            <Eye size={16} className="inline-block mr-2" /> View & Manage
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* 🌟 HEADER */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Expense <span className="text-indigo-600">Planner</span> & <span className="text-lime-600">Tracker</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium">Select a method to start tracking your finances.</p>
        </header>

        {/* 🎯 TAB NAVIGATION */}
        <div className="flex justify-center mb-12 bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-2 w-fit mx-auto border border-gray-200">
          <TabButton
            tab="withAmount"
            icon={TrendingUp}
            colorClass="ring-indigo-500 text-indigo-600"
            text="Expense Planner (Budget)"
          />
          <TabButton
            tab="withoutAmount"
            icon={FileText}
            colorClass="ring-lime-500 text-lime-600"
            text="Expense Tracker (Daily)"
          />
        </div>

        {/* 📋 FORMS SECTION */}

        {/* 1. WITH AMOUNT FORM - INDIGO THEME */}
        {activeTab === "withAmount" && (
          <FormContainer
            isLeft={true}
            color="indigo"
            imageSrc={img1} // <-- Image 1 for Budgeted
          >
            <div className="flex items-center mb-6 border-b pb-4 border-indigo-100">
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4 shadow-inner">
                <TrendingUp size={24} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Create Budgeted Expense
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmitWithAmount)} className="space-y-6">
              <div>
                <label className="font-semibold text-gray-700 flex items-center mb-2">
                  <span className="mr-2">🏷️</span> Expense Name
                </label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  placeholder="e.g., Monthly Groceries"
                  className="w-full p-4 border border-gray-300 rounded-xl mt-1 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition shadow-sm"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 flex items-center mb-2">
                  <DollarSign size={18} className="mr-2 text-indigo-500" /> Total Budget (in {RupeeSymbol})
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 font-bold text-lg">{RupeeSymbol}</span>
                  </div>
                  <input
                    {...register("amount", { required: true, min: 1, valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    placeholder="Enter total amount"
                    className="w-full p-4 pl-8 border border-gray-300 rounded-xl mt-1 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition shadow-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl text-xl font-bold transition-all flex items-center justify-center ${loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-300/60"
                  } text-white`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <Loader2 size={24} className="animate-spin mr-3" /> Creating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Plus size={24} className="mr-3" /> Create Budget
                  </span>
                )}
              </button>
            </form>
          </FormContainer>
        )}

        {/* 2. WITHOUT AMOUNT FORM - LIME GREEN THEME */}
        {activeTab === "withoutAmount" && (
          <FormContainer
            isLeft={false}
            color="lime"
            imageSrc={img2} // <-- Image 2 for Free Log
          >
            <div className="flex items-center mb-6 border-b pb-4 border-lime-100">
              <div className="h-12 w-12 bg-lime-100 rounded-full flex items-center justify-center mr-4 shadow-inner">
                <FileText size={24} className="text-lime-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Create Daily Expenses
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmitWithoutAmount)} className="space-y-6">
              <div>
                <label className="font-semibold text-gray-700 flex items-center mb-2">
                  <span className="mr-2">🏷️</span> Daily Expense Name
                </label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  placeholder="e.g., Market, Place name"
                  className="w-full p-4 border border-gray-300 rounded-xl mt-1 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-lime-100 focus:border-lime-400 transition shadow-sm"
                />
              </div>
              <div className="bg-lime-50 p-4 rounded-xl border border-lime-200 shadow-inner">
                <div className="flex items-center text-lime-700 mb-2">
                  <Zap size={20} className="mr-2" />
                  <span className="font-semibold">Quick Tip:</span>
                </div>
                <p className="text-gray-700 text-sm">
                  You can add amounts and items later. Just a daily expense name is needed for now.
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl text-xl font-bold transition-all flex items-center justify-center ${loading
                  ? "bg-lime-400 cursor-not-allowed"
                  : "bg-lime-500 hover:bg-lime-600 shadow-lg shadow-lime-300/60"
                  } text-white`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <Loader2 size={24} className="animate-spin mr-3" /> Creating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Plus size={24} className="mr-3" /> Start Adding
                  </span>
                )}
              </button>
            </form>
          </FormContainer>
        )}


        {/* ---------------------------------------------------------------------------------- */}
        {/* 3. CONDITIONAL HISTORY SECTION */}
        {/* ---------------------------------------------------------------------------------- */}

        {activeTab === "withAmount" && (
          <div className="order-3 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mb-12">
            <div className="flex items-center justify-between mb-6 border-b pb-3 border-indigo-100">
              <div className="flex items-center">
                <TrendingUp size={20} className="text-indigo-600 mr-2" />
                <h3 className="text-xl font-bold text-gray-800">
                  Budgeted Plans History
                </h3>
              </div>
              <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                {expenses.length} Plans
              </div>
            </div>

            {isLoadingExpenses ? (
              <div className="text-center py-8">
                <Loader2 size={30} className="inline-block animate-spin text-indigo-600" />
                <p className="mt-2 text-gray-600">Loading budgets...</p>
              </div>
            ) : expenses.length === 0 ? (
              <div className="text-center py-8 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <p className="font-medium text-gray-600">No active budgeted plans found. Create one above!</p>
              </div>
            ) : (
              <div className="overflow-x-auto pb-4 -mx-2">
                <div className="flex space-x-4 min-w-max pb-4 px-2">
                  {expenses.map((expense) => (
                    <HistoryCard
                      key={expense._id}
                      expense={expense}
                      isBudgeted={true}
                      handleDelete={handleDeleteExpense}
                      navigateTo={`/with-ammount/${expense._id}`}
                    />
                  ))}
                </div>
                <div className="text-center mt-2 text-gray-500 text-sm font-medium">
                  <p>← Scroll horizontally to see all plans →</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "withoutAmount" && (
          <div className="order-3 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mb-12">
            <div className="flex items-center justify-between mb-6 border-b pb-3 border-lime-100">
              <div className="flex items-center">
                <FileText size={20} className="text-lime-600 mr-2" />
                <h3 className="text-xl font-bold text-gray-800">
                  Free Expense Logs History
                </h3>
              </div>
              <div className="bg-lime-100 text-lime-600 px-3 py-1 rounded-full text-sm font-semibold">
                {withoutAmountExpenses.length} Logs
              </div>
            </div>

            {isLoadingWithoutAmount ? (
              <div className="text-center py-8">
                <Loader2 size={30} className="inline-block animate-spin text-lime-600" />
                <p className="mt-2 text-gray-600">Loading logs...</p>
              </div>
            ) : withoutAmountExpenses.length === 0 ? (
              <div className="text-center py-8 bg-lime-50/50 rounded-xl border border-lime-100">
                <p className="font-medium text-gray-600">No free expense logs found. Create one above!</p>
              </div>
            ) : (
              <div className="overflow-x-auto pb-4 -mx-2">
                <div className="flex space-x-4 min-w-max pb-4 px-2">
                  {withoutAmountExpenses.map((expense) => (
                    <HistoryCard
                      key={expense._id}
                      expense={expense}
                      isBudgeted={false}
                      handleDelete={handleDeleteWithoutAmountExpense}
                      navigateTo={`/without-amount/${expense._id}`}
                    />
                  ))}
                </div>
                <div className="text-center mt-2 text-gray-500 text-sm font-medium">
                  <p>← Scroll horizontally to see all logs →</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ℹ️ INFO SECTION */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>💡 <span className="font-medium">Tip:</span> Switch between tabs to manage different types of expenses</p>
        </div>
      </div>
    </div>
  );
}

export default Home;