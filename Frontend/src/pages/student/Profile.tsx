import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-6">Profile</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-display font-bold">
            {user?.name?.[0]}
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-foreground">{user?.name}</h2>
            <p className="text-sm text-muted-foreground capitalize flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> {user?.role}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input defaultValue={user?.name} className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input defaultValue={user?.email} className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Add phone number" className="pl-10" />
            </div>
          </div>
          <Button className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity">
            Save Changes
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
