import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api'; // Use API
import { Minus, Plus, ShoppingCart } from 'lucide-react';

const TakeOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]); // Fetch products
    const [cart, setCart] = useState({});

    // Load products on mount
    useEffect(() => {
        const load = async () => {
            const data = await api.getProducts();
            setProducts(data);
        };
        load();
    }, []);

    const updateQuantity = (productId, delta) => {
        setCart(prev => {
            const current = prev[productId] || 0;
            const next = Math.max(0, current + delta);
            return { ...prev, [productId]: next };
        });
    };

    const handleSendOrder = async () => {
        const items = Object.entries(cart)
            .filter(([_, qty]) => qty > 0)
            .map(([pid, qty]) => {
                const product = products.find(p => p.id === parseInt(pid));
                return {
                    productId: product.id,
                    name: product.name,
                    price: product.price * qty,
                    quantity: qty,
                    status: 'pending',
                    orderedBy: 'Garçom' // Simplification
                };
            });

        if (items.length === 0) return;

        // Post each item (Mock multiple posts)
        for (const item of items) {
            await api.addOrder(id, item);
        }

        navigate('/');
    };

    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <header className="header">
                <div>
                    <h1>Novo Pedido</h1>
                    <p style={{ opacity: 0.8 }}>Mesa {id}</p>
                </div>
            </header>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {products.map(product => (
                    <div key={product.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4>{product.name}</h4>
                            <div style={{ color: '#94a3b8' }}>R$ {product.price.toFixed(2)}</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#1e293b', padding: '0.25rem', borderRadius: '8px' }}>
                            <button onClick={() => updateQuantity(product.id, -1)} className="btn-icon">
                                <Minus size={16} />
                            </button>
                            <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>
                                {cart[product.id] || 0}
                            </span>
                            <button onClick={() => updateQuantity(product.id, 1)} className="btn-icon">
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {totalItems > 0 && (
                <div style={{
                    position: 'fixed', bottom: '90px', left: '1rem', right: '1rem',
                    backgroundColor: '#3b82f6', borderRadius: '12px', padding: '1rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShoppingCart size={24} color="white" />
                        <span style={{ fontWeight: 'bold', color: 'white' }}>{totalItems} itens</span>
                    </div>
                    <button onClick={handleSendOrder} style={{
                        backgroundColor: 'white', color: '#3b82f6', border: 'none',
                        padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold'
                    }}>
                        Enviar
                    </button>
                </div>
            )}
        </div>
    );
};

export default TakeOrder;
