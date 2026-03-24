import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Upload, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

const Sales = () => {
  const { token, user } = useAuth();
  const [sales, setSales] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  
  // New sale state
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [customer, setCustomer] = useState('');

  const fetchSales = async () => {
    try {
      const res = await axios.get('/api' + '/sales', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSales(res.data);
    } catch (error) {
      console.error('Failed to fetch sales', error);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const res = await axios.get('/api' + '/items', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventoryItems(res.data);
    } catch (error) {
      console.error('Failed to fetch inventory items', error);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchInventoryItems();
  }, [token]);

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user?.role !== 'admin') return alert('Access denied');
      await axios.post('/api' + '/sales', {
        item, quantity: Number(quantity), price: Number(price), customer
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItem(''); setQuantity(''); setPrice(''); setCustomer('');
      fetchSales();
    } catch (error) {
      console.error('Failed to add sale', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (user?.role !== 'admin') return alert('Access denied');
      await axios.delete(`/api/sales/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSales();
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      if (user?.role !== 'admin') {
        alert('Access denied');
        return;
      }
      
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const formattedData = jsonData.map((row: any) => ({
        item: row.item || row.Item || '',
        quantity: Number(row.quantity || row.Quantity || row.qty || 1),
        price: Number(row.price || row.Price || 0),
        customer: row.customer || row.Customer || 'Imported'
      })).filter(p => p.item && p.quantity && p.price);

      if (formattedData.length > 0) {
        await axios.post('/api' + '/sales/batch', formattedData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchSales();
        alert(`Successfully imported ${formattedData.length} sales!`);
      } else {
        alert("No valid data found in the spreadsheet.");
      }
    } catch (error) {
      console.error('Error importing file', error);
      alert('Failed to import file. Check console for details.');
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

  const filteredSales = sales.filter(s => s.item.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold tracking-tight"
        >
          Sales
        </motion.h1>
        {user?.role === 'admin' && (
          <label className={`cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Import Excel
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" disabled={isImporting} />
          </label>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="mb-6">
          <CardContent className="p-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search items..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sales Ledger</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-lg">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-lg rounded-bl-lg">Item</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Quantity</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Date</th>
                      {user?.role === 'admin' && <th className="px-6 py-4 rounded-tr-lg rounded-br-lg text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map((sale, index) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={sale._id} 
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">{sale.item}</td>
                        <td className="px-6 py-4 text-muted-foreground">{sale.customer}</td>
                        <td className="px-6 py-4">{sale.quantity}</td>
                        <td className="px-6 py-4 font-medium">${sale.price}</td>
                        <td className="px-6 py-4 text-muted-foreground">{new Date(sale.date).toLocaleDateString()}</td>
                        {user?.role === 'admin' && (
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/20" onClick={() => handleDelete(sale._id)}>
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                    {filteredSales.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No sales found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {user?.role === 'admin' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <Card className="sticky top-[88px]">
              <CardHeader>
                <CardTitle>Record New Sale</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddSale} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Item Name</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={item} 
                      onChange={e => {
                        setItem(e.target.value);
                        // Auto-fill price if possible
                        const selected = inventoryItems.find(i => i.name === e.target.value);
                        if (selected && !price) setPrice(selected.price);
                      }} 
                      required
                    >
                      <option value="" disabled>Select an item</option>
                      {inventoryItems.map(invItem => (
                        <option key={invItem._id} value={invItem.name}>{invItem.name} ({invItem.sku})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Customer</label>
                    <Input value={customer} onChange={e => setCustomer(e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quantity</label>
                      <Input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sale Price</label>
                      <Input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white">
                    <Plus size={16} className="mr-2" />
                    Record Sale
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Sales;
