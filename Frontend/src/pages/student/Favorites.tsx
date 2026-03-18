import { motion } from 'framer-motion';
import { menuItems } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { Heart, Plus, Star, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function FavoritesPage() {
  // Mock favorites - first 4 items
  const [favIds] = useState(new Set(['1', '3', '4', '6']));
  const favItems = menuItems.filter(i => favIds.has(i.id));
  const { addItem } = useCart();

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-1">Favorites</h1>
        <p className="text-muted-foreground mb-6">Your saved dishes</p>
      </motion.div>

      {favItems.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg font-display font-bold text-foreground">No favorites yet</p>
          <p className="text-muted-foreground text-sm">Heart items from the menu to save them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card overflow-hidden group"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-primary text-primary" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-semibold text-foreground">{item.name}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                    <span className="text-xs font-semibold text-foreground">{item.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-display font-bold text-foreground">${item.price.toFixed(2)}</span>
                    {item.calories && <span className="text-xs text-muted-foreground flex items-center gap-1"><Flame className="w-3 h-3" />{item.calories}</span>}
                  </div>
                  <Button size="sm" onClick={() => addItem(item)} className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 rounded-lg px-4">
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
