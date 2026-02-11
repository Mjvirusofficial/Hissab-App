import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TrendingUp, FileText, Plus, Trash2, Eye, Loader2, DollarSign, Calendar, Package, Zap } from 'lucide-react';
import SEO from "../component/SEO";
import {
  createExpense,
  getAllExpenses,
  deleteExpense,
  createWithoutAmountExpense,
  getAllWithoutAmountExpenses,
  deleteWithoutAmountExpense
} from "../api/allApi";

import img1 from '../assets/imgv2.mp4'
import img2 from '../assets/imgv.mp4'

const RupeeSymbol = "₹";

const formatProductName = (name) => {
  if (!name) return '';
  return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

function Home() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [withoutAmountExpenses, setWithoutAmountExpenses] = useState([]);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);
  const [isLoadingWithoutAmount, setIsLoadingWithoutAmount] = useState(true);
  const [activeTab, setActiveTab] = useState("withAmount");

  const fetchExpenses = async () => {
    setIsLoadingExpenses(true);
    try {
      const response = await getAllExpenses();
      if (response && response.success && Array.isArray(response.data)) {
        setExpenses(response.data);
      } else { setExpenses([]); }
    } catch (error) { setExpenses([]); }
    finally { setIsLoadingExpenses(false); }
  };

  const fetchWithoutAmountExpenses = async () => {
    setIsLoadingWithoutAmount(true);
    try {
      const result = await getAllWithoutAmountExpenses();
      if (result && result.success && Array.isArray(result.data)) {
        setWithoutAmountExpenses(result.data);
      } else { setWithoutAmountExpenses([]); }
    } catch (err) { setWithoutAmountExpenses([]); }
    finally { setIsLoadingWithoutAmount(false); }
  };

  const onSubmitWithAmount = async (data) => {
    setLoading(true);
    try {
      const response = await createExpense({ name: data.name, totalAmount: Number(data.amount) });
      if (response && response.success) {
        const newId = response.data?._id || response.data?.id;
        if (newId) {
          reset();
          await fetchExpenses();
          navigate(`/with-ammount/${newId}`);
        }
      }
    } catch (error) { alert("❌ Creation failed."); }
    finally { setLoading(false); }
  };

  const onSubmitWithoutAmount = async (data) => {
    setLoading(true);
    try {
      const response = await createWithoutAmountExpense({ name: data.name });
      if (response && response.success) {
        const newId = response.data?._id || response.data?.id;
        if (newId) {
          reset();
          await fetchWithoutAmountExpenses();
          navigate(`/without-amount/${newId}`);
        }
      }
    } catch (error) { alert("❌ Creation failed."); }
    finally { setLoading(false); }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm("🗑️ Delete this expense?")) return;
    try {
      const response = await deleteExpense(expenseId);
      if (response && response.success) {
        setExpenses(expenses.filter(e => e._id !== expenseId));
      }
    } catch (error) { alert("❌ Failed to delete."); }
  };

  const handleDeleteWithoutAmountExpense = async (expenseId) => {
    if (!window.confirm("🗑️ Delete this expense?")) return;
    try {
      const response = await deleteWithoutAmountExpense(expenseId);
      if (response && response.success) {
        setWithoutAmountExpenses(withoutAmountExpenses.filter(e => e._id !== expenseId));
      }
    } catch (error) { alert("❌ Failed to delete."); }
  };

  useEffect(() => {
    fetchExpenses();
    fetchWithoutAmountExpenses();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return dateString; }
  };

  const calculateTotalSpent = (expense) => {
    if (expense.totalSpent !== undefined && expense.totalSpent !== null) return expense.totalSpent;
    return expense.products?.reduce((total, product) => total + (product.amount || 0), 0) || 0;
  };

  // --- UI COMPONENTS ---
  const TabButton = ({ tab, icon: Icon, colorClass, mainText, subText }) => (
    <button
      className={`flex items-center justify-center flex-1 px-2 md:px-6 py-2 md:py-3 rounded-2xl transition-all duration-300 ${activeTab === tab
        ? `bg-white text-gray-800 shadow-lg ring-2 md:ring-4 ${colorClass}`
        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
        }`}
      onClick={() => setActiveTab(tab)}
    >
      <Icon size={16} className={`mr-2 ${activeTab === tab ? colorClass.replace('ring-2 ', 'text-').replace('ring-4 ', 'text-').replace('ring-', 'text-') : ''}`} />
      <div className="flex flex-col text-center md:text-left">
        <span className="text-[11px] md:text-lg font-bold leading-tight">{mainText}</span>
        <span className="text-[9px] md:text-sm font-medium opacity-70">{subText}</span>
      </div>
    </button>
  );

  const FormContainer = ({ children, isLeft, color }) => (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center mb-6 md:mb-16`}>
      <div className={`${isLeft ? 'md:order-1' : 'md:order-2'} order-1 w-full`}>
        <div className={`w-full bg-white p-5 md:p-8 rounded-3xl shadow-xl border-t-4 border-${color}-500`}>
          {children}
        </div>
      </div>
      <div className={`${isLeft ? 'md:order-2' : 'md:order-1'} order-2 flex items-center justify-center w-full`}>
        <div className="bg-white rounded-3xl shadow-md border border-gray-50 p-2 w-full max-w-[280px] md:max-w-full aspect-video flex items-center justify-center">
          <video key={activeTab} src={activeTab === "withAmount" ? img1 : img2} autoPlay loop muted playsInline className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );

  const HistoryCard = ({ expense, isBudgeted, handleDelete, navigateTo }) => {
    const spent = calculateTotalSpent(expense);
    const cardBorder = isBudgeted ? 'border-indigo-500' : 'border-lime-500';

    return (
      <div className={`bg-white rounded-xl shadow-md p-3 md:p-5 border-l-4 ${cardBorder} min-w-[210px] md:min-w-[300px] w-[210px] md:w-[300px] flex-shrink-0 transition-all`}>
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-[11px] md:text-lg font-bold text-gray-800 truncate">{formatProductName(expense.name) || 'Untitled Log'}</h4>
          <button onClick={() => handleDelete(expense._id)} className="text-red-500 p-1 bg-red-50 rounded-full"><Trash2 size={12} /></button>
        </div>
        <div className="space-y-1.5 pt-2 border-t border-gray-50">
          {isBudgeted && (
            <div className="flex justify-between items-center text-[10px] md:text-sm">
              <span className="text-indigo-600 flex items-center"><DollarSign size={12} /> Budget:</span>
              <span className="font-bold text-indigo-700">{RupeeSymbol}{expense.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-[10px] md:text-sm">
            <span className={`${isBudgeted ? 'text-indigo-600' : 'text-lime-700'} flex items-center`}><DollarSign size={12} /> Spent:</span>
            <span className="font-bold">{RupeeSymbol}{spent.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-[9px] md:text-xs text-gray-400">
            <span><Package size={10} className="inline mr-1" />{expense.products?.length || 0} items</span>
            <span><Calendar size={10} className="inline mr-1" />{formatDate(expense.createdAt)}</span>
          </div>
          <button onClick={() => navigate(navigateTo)} className={`w-full ${isBudgeted ? 'bg-indigo-600' : 'bg-lime-500'} text-white py-1.5 rounded-lg text-[10px] md:text-sm mt-1 flex items-center justify-center font-medium`}><Eye size={12} className="mr-1.5" /> View</button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-3 md:p-8">
      <SEO
        title="Dashboard"
        description="View your financial overview, recent transactions, and budget status on your personalized dashboard."
        url="https://dhisaab.netlify.app/"
      />
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6 md:mb-10">
          <h1 className="text-xl md:text-5xl font-extrabold text-gray-900 mb-1">
            Expense <span className="text-indigo-600">Planner</span> & <span className="text-lime-600">Tracker</span>
          </h1>
          <p className="text-[10px] md:text-lg text-gray-500">Select a method to start tracking your finances. Manage your money smarter 💰</p>
        </header>

        <div className="flex justify-center gap-2 mb-8 bg-gray-200/50 backdrop-blur-sm rounded-2xl p-1.5 w-full max-w-md mx-auto">
          <TabButton tab="withAmount" icon={TrendingUp} colorClass="ring-indigo-500 text-indigo-600" mainText="Expense Planner" subText="(Budget)" />
          <TabButton tab="withoutAmount" icon={FileText} colorClass="ring-lime-500 text-lime-600" mainText="Expense Tracker" subText="(Daily)" />
        </div>

        {activeTab === "withAmount" ? (
          <FormContainer isLeft={true} color="indigo">
            <div className="flex items-center mb-4 border-b pb-3 border-indigo-50">
              <TrendingUp size={20} className="text-indigo-600 mr-2" />
              <h2 className="text-sm md:text-2xl font-bold text-gray-800">Create Budgeted Expense</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmitWithAmount)} className="space-y-4">
              <div>
                <label className="text-[11px] md:text-base font-semibold text-gray-700 block mb-1">🏷️ Expense Name</label>
                <input {...register("name", { required: true })} type="text" placeholder="e.g., Groceries" className="w-full p-2.5 md:p-4 border border-gray-200 rounded-xl text-xs md:text-base focus:ring-2 focus:ring-indigo-500/20 outline-none" />
              </div>
              <div>
                <label className="text-[11px] md:text-base font-semibold text-gray-700 block mb-1">💰 Total Budget ({RupeeSymbol})</label>
                <input {...register("amount", { required: true, min: 1, valueAsNumber: true })} type="number" placeholder="0.00" className="w-full p-2.5 md:p-4 border border-gray-200 rounded-xl text-xs md:text-base focus:ring-2 focus:ring-indigo-500/20 outline-none" />
              </div>
              <button type="submit" className="w-full py-2.5 md:py-4 bg-indigo-600 text-white rounded-xl text-sm md:text-xl font-bold shadow-md active:scale-95 transition-transform">Create Budget</button>
            </form>
          </FormContainer>
        ) : (
          <FormContainer isLeft={false} color="lime">
            <div className="flex items-center mb-4 border-b pb-3 border-lime-50">
              <FileText size={20} className="text-lime-600 mr-2" />
              <h2 className="text-sm md:text-2xl font-bold text-gray-800">Create Daily Expenses</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmitWithoutAmount)} className="space-y-4">
              <div>
                <label className="text-[11px] md:text-base font-semibold text-gray-700 block mb-1">🏷️ Daily Log Name</label>
                <input {...register("name", { required: true })} type="text" placeholder="e.g., Office Trip" className="w-full p-2.5 md:p-4 border border-gray-200 rounded-xl text-xs md:text-base focus:ring-2 focus:ring-lime-500/20 outline-none" />
              </div>
              <div className="bg-lime-50 p-2.5 rounded-xl border border-lime-100 flex items-center text-[10px] md:text-sm text-lime-800 font-medium">
                <Zap size={14} className="mr-2" /> Add amounts later anytime!
              </div>
              <button type="submit" className="w-full py-2.5 md:py-4 bg-lime-500 text-white rounded-xl text-sm md:text-xl font-bold shadow-md active:scale-95 transition-transform">Start Adding</button>
            </form>
          </FormContainer>
        )}

        <div className="bg-white rounded-3xl shadow-lg p-4 md:p-8 mb-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-xs md:text-xl font-bold text-gray-800">📜 Recent History</h3>
            <span className="text-[9px] md:text-sm bg-gray-100 px-2 py-0.5 rounded-full font-bold">Total: {activeTab === "withAmount" ? expenses.length : withoutAmountExpenses.length}</span>
          </div>
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex space-x-3 min-w-max">
              {(activeTab === "withAmount" ? expenses : withoutAmountExpenses).map((expense) => (
                <HistoryCard key={expense._id} expense={expense} isBudgeted={activeTab === "withAmount"} handleDelete={activeTab === "withAmount" ? handleDeleteExpense : handleDeleteWithoutAmountExpense} navigateTo={activeTab === "withAmount" ? `/with-ammount/${expense._id}` : `/without-amount/${expense._id}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;