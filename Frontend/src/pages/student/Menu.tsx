import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuItems, categories } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { Search, Star, Plus, Heart, Flame } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function MenuPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('1');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { addItem } = useCart();

  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === '1' || item.categoryId === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-1">Menu</h1>
        <p className="text-muted-foreground mb-6">Discover delicious meals prepared fresh for you</p>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search for dishes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-12 h-12 rounded-xl text-base bg-card border-border"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'gradient-primary text-primary-foreground shadow-glow'
                : 'bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card overflow-hidden group"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <button
                  onClick={() => toggleFav(item.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${favorites.has(item.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                  />
                </button>
                {item.isVeg && (
                  <span className="absolute top-3 left-3 bg-success/90 text-success-foreground text-xs font-bold px-2 py-1 rounded-md">
                    VEG
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-semibold text-foreground leading-tight">{item.name}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                    <span className="text-xs font-semibold text-foreground">{item.rating}</span>
                    <span className="text-xs text-muted-foreground">({item.ratingCount})</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-display font-bold text-foreground">${item.price.toFixed(2)}</span>
                    {item.calories && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Flame className="w-3 h-3" />{item.calories} cal
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addItem(item)}
                    className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity rounded-lg px-4"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No items found</p>
          <p className="text-sm text-muted-foreground mt-1">Try a different search or category</p>
        </div>
      )}
    </div>
  );
}
