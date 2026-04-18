import { useEffect, useState } from 'react';
import { UserNavbar } from '../components/UserNavbar';
import { Card, CardBody } from '../components/Card';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { getApiUrl, getAssetUrl } from '../utils/apiConfig';

export function Souvenirs() {
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(getApiUrl('/api/souvenirs'));
        if (!response.ok) throw new Error('Failed to load souvenirs');
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setProductError((err as Error).message || 'Unable to load souvenirs');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      <UserNavbar />

      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div>
            <h1 className="text-primary mb-2">Souvenir Shop</h1>
            <p className="text-muted-foreground">Browse our collection of religious items</p>
          </div>
        </motion.div>

        {loadingProducts ? (
          <div className="text-center text-muted-foreground">Loading souvenirs...</div>
        ) : productError ? (
          <div className="text-center text-destructive">{productError}</div>
        ) : products.length === 0 ? (
          <div className="text-center text-muted-foreground">No souvenirs found in the database.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
              <Card hover>
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardBody>
                  <h3 className="mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}
