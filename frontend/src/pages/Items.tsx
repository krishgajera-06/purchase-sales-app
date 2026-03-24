import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Upload, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

const Items = () => {
  const { token, user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  
  // New item state
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');

  const fetchItems = async () => {
    try {
      const res = await axios.get('/api' + '/items', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data);
    } catch (error) {
      console.error('Failed to fetch items', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [token]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user?.role !== 'admin') return alert('Access denied');
      await axios.post('/api' + '/items', {
        name, 
        sku, 
        description, 
        price: Number(price), 
        stockQuantity: Number(stockQuantity) || 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName(''); setSku(''); setDescription(''); setPrice(''); setStockQuantity('');
      fetchItems();
    } catch (error) {
      console.error('Failed to add item', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (user?.role !== 'admin') return alert('Access denied');
      await axios.delete('/api' + `/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
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
        name: row.name || row.Name || row.item || '',
        sku: row.sku || row.SKU || `ITM-${Math.floor(Math.random() * 10000)}`,
        description: row.description || row.Description || '',
        price: Number(row.price || row.Price || 0),
        stockQuantity: Number(row.stockQuantity || row.qty || row.Quantity || 0)
      })).filter(i => i.name && i.sku);

      if (formattedData.length > 0) {
        await axios.post('/api' + '/items/batch', formattedData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchItems();
        alert(`Successfully imported ${formattedData.length} items!`);
      } else {
        alert("No valid data found in the spreadsheet.");
      }
    } catch (error) {
      console.error('Error importing file', error);
      alert('Failed to import file. Check console (and note that SKU values must be unique).');
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold tracking-tight"
        >
          Items Master
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
                placeholder="Search items by name or SKU..." 
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
              <CardTitle>Item Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-lg">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-lg">SKU</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Stock Qty</th>
                      <th className="px-6 py-4">Price</th>
                      {user?.role === 'admin' && <th className="px-6 py-4 rounded-tr-lg text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item, index) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={item._id} 
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-muted-foreground">{item.sku}</td>
                        <td className="px-6 py-4 font-bold">{item.name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.stockQuantity <= 5 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                            {item.stockQuantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium">${item.price}</td>
                        {user?.role === 'admin' && (
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/20" onClick={() => handleDelete(item._id)}>
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                    {filteredItems.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No items found.</td>
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
                <CardTitle>Add New Item</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddItem} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SKU</label>
                    <Input value={sku} onChange={e => setSku(e.target.value)} placeholder="e.g. ITM-001" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Item Name</label>
                    <Input value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Input value={description} onChange={e => setDescription(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price</label>
                      <Input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Stock Qty</label>
                      <Input type="number" min="0" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-2">
                    <Plus size={16} className="mr-2" />
                    Save Item
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

export default Items;
