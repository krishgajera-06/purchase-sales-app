import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2 } from 'lucide-react';

const Purchases = () => {
  const { token, user } = useAuth();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New purchase state
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [supplier, setSupplier] = useState('');

  const fetchPurchases = async () => {
    try {
      const res = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/purchases', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPurchases(res.data);
    } catch (error) {
      console.error('Failed to fetch purchases', error);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [token]);

  const handleAddPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user?.role !== 'admin') return alert('Access denied');
      await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/purchases', {
        item, quantity: Number(quantity), price: Number(price), supplier
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItem(''); setQuantity(''); setPrice(''); setSupplier('');
      fetchPurchases();
    } catch (error) {
      console.error('Failed to add purchase', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (user?.role !== 'admin') return alert('Access denied');
      await axios.delete(`/purchases/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPurchases();
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  const filteredPurchases = purchases.filter(p => p.item.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold tracking-tight"
        >
          Purchases
        </motion.h1>
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
              <CardTitle>Inventory List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-lg">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-lg rounded-bl-lg">Item</th>
                      <th className="px-6 py-4">Supplier</th>
                      <th className="px-6 py-4">Quantity</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Date</th>
                      {user?.role === 'admin' && <th className="px-6 py-4 rounded-tr-lg rounded-br-lg text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPurchases.map((purchase, index) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={purchase._id} 
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">{purchase.item}</td>
                        <td className="px-6 py-4 text-muted-foreground">{purchase.supplier}</td>
                        <td className="px-6 py-4">{purchase.quantity}</td>
                        <td className="px-6 py-4 font-medium">${purchase.price}</td>
                        <td className="px-6 py-4 text-muted-foreground">{new Date(purchase.date).toLocaleDateString()}</td>
                        {user?.role === 'admin' && (
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/20" onClick={() => handleDelete(purchase._id)}>
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                    {filteredPurchases.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No purchases found.</td>
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
                <CardTitle>Add New Purchase</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPurchase} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Item Name</label>
                    <Input value={item} onChange={e => setItem(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Supplier</label>
                    <Input value={supplier} onChange={e => setSupplier(e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quantity</label>
                      <Input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Unit Price</label>
                      <Input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-2">
                    <Plus size={16} className="mr-2" />
                    Record Purchase
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

export default Purchases;
