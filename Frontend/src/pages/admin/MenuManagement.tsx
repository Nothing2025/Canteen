import { useState } from 'react';
import { motion } from 'framer-motion';
import { menuItems as initialItems, categories } from '@/data/mockData';
import { MenuItem } from '@/types';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function MenuManagement() {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success('Item deleted');
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;

    if (editItem) {
      setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, name, price, description } : i));
      toast.success('Item updated');
    } else {
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name, price, description,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        categoryId: '2', rating: 0, ratingCount: 0, isVeg: true, isAvailable: true,
      };
      setItems(prev => [newItem, ...prev]);
      toast.success('Item added');
    }
    setEditItem(null);
    setDialogOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Menu Management</h1>
            <p className="text-muted-foreground text-sm">{items.length} items</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={o => { setDialogOpen(o); if (!o) setEditItem(null); }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-display text-foreground">{editItem ? 'Edit' : 'Add'} Menu Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Name</Label>
                  <Input name="name" defaultValue={editItem?.name} required />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Price ($)</Label>
                  <Input name="price" type="number" step="0.01" defaultValue={editItem?.price} required />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Description</Label>
                  <Input name="description" defaultValue={editItem?.description} required />
                </div>
                <Button type="submit" className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                  {editItem ? 'Save Changes' : 'Add Item'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-card" />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Item</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rating</th>
                <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-sm text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{categories.find(c => c.id === item.categoryId)?.name}</td>
                  <td className="p-4 font-display font-semibold text-sm text-foreground">${item.price.toFixed(2)}</td>
                  <td className="p-4 text-sm text-foreground">⭐ {item.rating}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setEditItem(item); setDialogOpen(true); }} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
