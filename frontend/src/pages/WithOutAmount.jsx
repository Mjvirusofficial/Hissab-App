import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getWithoutAmountExpenseById,
  addProductToWithoutAmount,
  deleteProductFromWithoutAmount
} from '../api/allApi';
import { format } from 'date-fns';

// 💡 Lucide Icons
import { ChevronLeft, Plus, BarChart3, Package, Calendar, TrendingUp, Trash2, Loader2, Clock, ScrollText, Printer } from 'lucide-react';

const RupeeSymbol = "₹";

const formatProductName = (name) => {
  if (!name) return '';
  return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

function WithoutAmount() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingProduct, setAddingProduct] = useState(false);
  const [productName, setProductName] = useState('');
  const [productAmount, setProductAmount] = useState('');
  const [totalSpent, setTotalSpent] = useState(0);
  // const [deletingProductId, setDeletingProductId] = useState(null);

  const updateExpenseState = useCallback((data) => {
    setExpense(data);
    const spent = data.products?.reduce((sum, p) => sum + p.amount, 0) || 0;
    setTotalSpent(spent);
  }, []);

  const fetchExpense = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getWithoutAmountExpenseById(id);
      if (response.success && response.data) {
        updateExpenseState(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id, updateExpenseState]);

  useEffect(() => {
    fetchExpense();
  }, [fetchExpense]);

  const handlePrint = () => {
    window.print();
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productName.trim() || !productAmount || Number(productAmount) <= 0) {
      alert('Please enter valid item name and amount');
      return;
    }
    try {
      setAddingProduct(true);
      const response = await addProductToWithoutAmount(id, {
        name: productName.trim(),
        amount: Number(productAmount)
      });
      if (response.success) {
        fetchExpense();
        setProductName('');
        setProductAmount('');
      }
    } finally {
      setAddingProduct(false);
    }
  };

  const handleDeleteProduct = useCallback(async (productId) => {
    if (!window.confirm('Are you sure?')) return;
    // setDeletingProductId(productId);
    try {
      const response = await deleteProductFromWithoutAmount(id, productId);
      if (response.success) await fetchExpense();
    } finally {
      // setDeletingProductId(null);
    }
  }, [id, fetchExpense]);

  const formatDate = (dateString) => {
    try { return format(new Date(dateString), 'dd MMM yyyy'); } catch { return 'N/A'; }
  };

  const formatTime = (dateString) => {
    try { return format(new Date(dateString), 'hh:mm a'); } catch { return 'N/A'; }
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

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  // eslint-disable-next-line no-unused-vars
  const StatsCard = ({ icon: Icon, title, value, bgColor, valueColor }) => (
    <div className={`p-4 md:p-5 rounded-2xl shadow-sm text-center transition-all duration-300 hover:shadow-lg`} style={{ backgroundColor: bgColor }}>
      <Icon size={20} className="mx-auto mb-2" style={{ color: valueColor }} />
      <p className="text-xs md:text-base font-semibold text-gray-700 mb-1">{title}</p>
      <p className={`text-lg md:text-2xl font-extrabold`} style={{ color: valueColor }}>{value}</p>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 p-3 md:p-8">
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            body { background: white; padding: 0; }
            .print-table { display: table !important; width: 100%; border-collapse: collapse; }
            .print-header { display: block !important; margin-bottom: 20px; }
          }
          .print-table { display: none; }
          .print-header { display: none; }
        `}
      </style>

      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        {/* Navigation & Print Button */}
        <div className="flex justify-between items-center no-print">
          <button onClick={() => navigate('/')} className="flex items-center text-indigo-600 font-medium transition text-sm">
            <ChevronLeft size={20} /> Back
          </button>

          {/* Print Button: Grey BG, Lime Hover */}
          <button onClick={handlePrint} className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-lime-500 hover:text-black transition-all">
            <Printer size={16} /> Print Report
          </button>
        </div>

        {/* Stats Section (Restored) */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-md p-4 md:p-6 no-print">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4 border-gray-100 gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-extrabold text-gray-900 flex items-center">
                <BarChart3 size={24} className="mr-2 text-indigo-600" />
                {formatProductName(expense?.name)}
              </h1>
              <p className="text-gray-500 mt-1 text-[10px] md:text-sm">Created on {formatDate(expense?.createdAt)}</p>
            </div>
            <div className="text-2xl md:text-4xl font-extrabold text-indigo-600">
              {RupeeSymbol}{totalSpent.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <StatsCard icon={Package} title="Items" value={expense?.products?.length || 0} bgColor="#E6F0FF" valueColor="#4f46e5" />
            <StatsCard icon={Calendar} title="Last Added" value={getLastAddedDate()} bgColor="#F7FEE7" valueColor="#84cc16" />
            <StatsCard icon={TrendingUp} title="Highest" value={getHighestExpense()} bgColor="#FEEFEF" valueColor="#ef4444" />
          </div>
        </div>

        {/* Print Header (Visible only in Print) */}
        <div className="print-header text-center">
          <h1 className="text-2xl font-bold underline mb-2 uppercase">{expense?.name} - Expense Report</h1>
          <p>Total Items: {expense?.products?.length} | Grand Total: {RupeeSymbol}{totalSpent}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 no-print">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-5 md:p-6 lg:sticky lg:top-6 border-4 border-lime-500 transition-all">
              <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-4 border-b pb-3 border-lime-100 flex items-center">
                <Plus size={20} className="mr-2 text-lime-600" /> Add New Expense
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Item Name" className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lime-300 outline-none" required />
                <input type="number" value={productAmount} onChange={(e) => setProductAmount(e.target.value)} placeholder="Amount" className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lime-300 outline-none" required />
                <button type="submit" disabled={addingProduct} className="w-full py-3 rounded-xl font-bold transition text-white bg-lime-500 hover:bg-lime-600 shadow-lg">
                  {addingProduct ? 'Adding...' : 'Add Expense'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-md p-4 md:p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center border-b pb-3 no-print">
                <ScrollText size={20} className="mr-2 text-indigo-600" /> History
              </h2>

              {/* History Boxes with Date & Time */}
              <div className="flex space-x-3 pb-4 overflow-x-auto no-print">
                {expense?.products?.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).map((product) => (
                  <div key={product._id} className="min-w-[180px] md:min-w-[220px] p-3 md:p-4 bg-indigo-50 rounded-xl border-t-4 border-lime-500 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-[9px] md:text-[10px] text-indigo-500 font-bold mb-1">
                        <span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(product.date)}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {formatTime(product.date)}</span>
                      </div>
                      <span className="font-bold text-xs md:text-base text-gray-800 break-words line-clamp-2">
                        {formatProductName(product.name)}
                      </span>
                    </div>
                    <div className="flex justify-between items-end mt-4 pt-2 border-t border-indigo-100">
                      <div className="text-sm md:text-lg font-extrabold text-indigo-700">{RupeeSymbol}{product.amount.toLocaleString('en-IN')}</div>
                      <button onClick={() => handleDeleteProduct(product._id)} className="p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition shadow-sm">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Print Only Table */}
              <table className="print-table w-full border mt-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Date & Time</th>
                    <th className="border p-2">Item</th>
                    <th className="border p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expense?.products?.map(p => (
                    <tr key={p._id}>
                      <td className="border p-2 text-center">{formatDate(p.date)} {formatTime(p.date)}</td>
                      <td className="border p-2">{formatProductName(p.name)}</td>
                      <td className="border p-2 text-right">{RupeeSymbol}{p.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithoutAmount;