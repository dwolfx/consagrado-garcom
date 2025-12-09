import { useParams, useNavigate } from 'react-router-dom';
import { products, tables } from '../data/mockData';
import { Minus, Plus, ShoppingBag, ArrowLeft, Users } from 'lucide-react';
import { useState } from 'react';

const TakeOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cart, setCart] = useState({});

    // Find table and prepare "Who is ordering" list
    const table = tables.find(t => t.id === Number(id));
    const [selectedPerson, setSelectedPerson] = useState('table'); // 'table' or personId

    // Mock people if empty, to test interface
    const people = table?.people || [];

    // Group items by category
    const items = products;

    const handleAdd = (productId) => {
        setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
    };

    const handleRemove = (productId) => {
        setCart(prev => {
            const next = { ...prev };
            if (next[productId] > 0) next[productId] -= 1;
            return next;
        });
    };

    const getTotalItems = () => Object.values(cart).reduce((a, b) => a + b, 0);

    const handleSend = () => {
        if (getTotalItems() === 0) return;

        const ownerName = selectedPerson === 'table'
            ? "Mesa (Compartilhado)"
            : people.find(p => p.id === selectedPerson)?.name;

        alert(`Pedido enviado para Mesa ${id}!\nCliente: ${ownerName}`);
        navigate('/');
    };

    return (
        <div className="container" style={{ paddingBottom: '120px' }}>
            <header style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <button onClick={() => navigate(-1)} className="btn-outline" style={{ width: 'auto', padding: '0.5rem' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <h2>Mesa {table?.number} <span style={{ fontWeight: 'normal', fontSize: '1rem', color: 'var(--text-secondary)' }}>• Novo Pedido</span></h2>
                </div>

                {/* Customer Selector Carousel */}
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    <button
                        className={`btn ${selectedPerson === 'table' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ width: 'auto', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
                        onClick={() => setSelectedPerson('table')}
                    >
                        <Users size={16} style={{ display: 'inline', marginRight: '5px' }} />
                        Todos (Mesa)
                    </button>
                    {people.map(p => (
                        <button
                            key={p.id}
                            className={`btn ${selectedPerson === p.id ? 'btn-primary' : 'btn-outline'}`}
                            style={{ width: 'auto', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
                            onClick={() => setSelectedPerson(p.id)}
                        >
                            {p.avatar} {p.name}
                        </button>
                    ))}
                </div>
            </header>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {items.map(item => (
                    <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', marginBottom: 0 }}>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ marginBottom: '0.25rem' }}>{item.name}</h4>
                            <span style={{ color: 'var(--primary)' }}>R$ {item.price.toFixed(2)}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#111', borderRadius: '8px', padding: '4px' }}>
                            <button
                                onClick={() => handleRemove(item.id)}
                                style={{ background: 'none', border: 'none', color: 'white', padding: '8px' }}
                            >
                                <Minus size={18} />
                            </button>
                            <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>
                                {cart[item.id] || 0}
                            </span>
                            <button
                                onClick={() => handleAdd(item.id)}
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', padding: '8px' }}
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Floating Action Bar */}
            {getTotalItems() > 0 && (
                <div style={{
                    position: 'fixed', bottom: '70px', left: '1rem', right: '1rem', zIndex: 90
                }}>
                    <button onClick={handleSend} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                        <ShoppingBag size={20} />
                        Enviar {getTotalItems()} Itens
                    </button>
                </div>
            )}
        </div>
    );
};

export default TakeOrder;
