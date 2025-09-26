import Link from 'next/link';
import { WishlistList } from '@/components/wishlist/WishlistList';
import { DependentSection } from '@/components/dependents/DependentSection';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function DashboardPage() {

  return (
    <div className="space-y-8">
      {/* Seção Minhas Listas de Desejos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-display">Minhas Listas de Desejos</h2>
            <p className="text-sm text-dark-light">
              Gerenciando suas listas de desejos
            </p>
          </div>
          <Link href="/dashboard/new">
            <Button variant="ghost">
              <Plus className="mr-2 h-4 w-4" />
              Nova Lista
            </Button>
          </Link>
        </div>
        <WishlistList />
      </section>

      {/* Seção Meus Dependentes */}
      <DependentSection />
    </div>
  );
}