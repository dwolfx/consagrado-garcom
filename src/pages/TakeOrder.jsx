import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, supabase } from '../services/api';
import { ArrowLeft, Search, Check, Plus, Minus, ShoppingCart, User as UserIcon } from 'lucide-react';

const TakeOrder = () => {
    const { id } = useParams(); // Table ID
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState([]);

    // Assignment State
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [customerName, setCustomerName] = useState('');

    useEffect(() => {
        loadMenu();
    }, []);

    const loadMenu = async () => {
        try {
            const data = await api.getCategories();
            if (data && data.length > 0) {
                setCategories(data);
                setSelectedCategory(data[0].id);
            } else {
                // Mock for testing if DB is empty
                const MOCK_CATEGORIES = [
                    { id: 1, name: 'Bebidas', products: [{ id: 101, name: 'Heineken 600ml', price: 18.00 }, { id: 102, name: 'Coca-Cola', price: 6.00 }, { id: 103, name: 'Água Mineral', price: 4.00 }] },
                    { id: 2, name: 'Petiscos', products: [{ id: 201, name: 'Batata Frita', price: 25.00 }, { id: 202, name: 'Isca de Peixe', price: 45.00 }, { id: 203, name: 'Calabresa', price: 32.00 }] },
                    { id: 3, name: 'Pratos', products: [{ id: 301, name: 'Parmegiana', price: 59.90 }, { id: 302, name: 'Picanha', price: 89.90 }] }
                ];
                setCategories(MOCK_CATEGORIES);
                setSelectedCategory(MOCK_CATEGORIES[0].id);
            }
        } catch (error) {
            console.error('Error loading menu:', error);
        }
    };

    const handleItemClick = (product) => {
        setCurrentItem(product);
        setCustomerName('Mesa'); // Default to "Table" generic
        setAssignModalOpen(true);
    };

    const addToCart = () => {
        if (!currentItem) return;

        const newItem = {
            ...currentItem,
            orderedFor: customerName || 'Mesa',
            quantity: 1 // MVP: Simple add 1 by 1 or adjust in cart later? Let's just add 1.
        };

        setCart([...cart, newItem]);
        setAssignModalOpen(false);
        setCustomerName('');
    };

    const handleSendOrder = async () => {
        if (cart.length === 0) return;

        try {
            // Transform cart to order rows
            const ordersFormatted = cart.map(item => ({
                table_id: id,
                product_id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1,
                status: 'pending',
                ordered_by: item.orderedFor
            }));

            const { error } = await supabase.from('orders').insert(ordersFormatted);

            if (error) throw error;

            alert('Pedido enviado com sucesso!');
            navigate(`/people/${id}`); // Go back to table view
        } catch (error) {
            console.error('Error sending order:', error);
            alert('Erro ao enviar pedido.');
        }
    };

    const filteredProducts = search.trim() !== ''
        ? categories.flatMap(c => c.products).filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        : (selectedCategory
            ? categories.find(c => c.id === selectedCategory)?.products || []
            : []);

    return (
        <div className="container" style={{ padding: 0 }}>
            {/* Header */}
            <header style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 90,
                backgroundColor: 'var(--bg-secondary)', backdropFilter: 'blur(8px)',
                borderBottom: '1px solid #333', padding: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                maxWidth: '480px', margin: '0 auto',
                borderRadius: '0 0 16px 16px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', padding: '0.5rem', cursor: 'pointer' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2>Novo Pedido</h2>
                </div>
                {cart.length > 0 && (
                    <div style={{ background: 'var(--primary)', color: 'black', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 'bold' }}>
                        {cart.length}
                    </div>
                )}
            </header>

            <div style={{ height: '80px' }}></div>

            {/* Categories & Search */}
            <div style={{ padding: '1rem' }}>
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={24} />
                    <input
                        type="text"
                        placeholder="Buscar produto..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field"
                        style={{
                            paddingLeft: '3rem',
                            marginBottom: 0,
                            height: '54px',
                            fontSize: '1.1rem',
                            borderRadius: '12px'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            style={{
                                whiteSpace: 'nowrap',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                border: '1px solid #333',
                                backgroundColor: selectedCategory === cat.id ? 'var(--primary)' : 'var(--bg-secondary)',
                                color: selectedCategory === cat.id ? 'black' : 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            onClick={() => handleItemClick(product)}
                            className="card"
                            style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', cursor: 'pointer', border: '1px solid #333' }}
                        >
                            <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{product.name}</div>
                            <div style={{ color: 'var(--success)', fontWeight: 'bold' }}>R$ {product.price.toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart Bar */}
            {cart.length > 0 && (
                <div style={{
                    position: 'fixed', bottom: 0, left: 0, right: 0,
                    backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid #333',
                    padding: '1rem', zIndex: 100, maxWidth: '480px', margin: '0 auto',
                    borderRadius: '16px 16px 0 0', boxShadow: '0 -4px 10px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem', maxHeight: '100px', overflowY: 'auto' }}>
                        <div style={{ width: '100%' }}>
                            {cart.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #333', padding: '0.2rem 0' }}>
                                    <span>{item.name} <small style={{ color: '#94a3b8' }}>({item.orderedFor})</small></span>
                                    <span>R$ {item.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleSendOrder} className="btn btn-primary btn-lg">
                        <Check size={24} />
                        Enviar Pedido ({cart.length})
                    </button>
                </div>
            )}

            {/* Spacer for Cart */}
            <div style={{ height: cart.length > 0 ? '160px' : '20px' }}></div>

            {/* Assignment Modal */}
            {assignModalOpen && currentItem && (
                <div className="drawer-overlay open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card" style={{ width: '90%', maxWidth: '350px', zIndex: 202, backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Adicionar {currentItem.name}</h3>

                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Para quem?</label>
                        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <UserIcon size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    className="input-field"
                                    style={{ margin: 0, paddingLeft: '2.5rem' }}
                                    placeholder="Nome (ex: João)"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') addToCart();
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button onClick={() => setAssignModalOpen(false)} className="btn btn-outline">Cancelar</button>
                            <button onClick={addToCart} className="btn btn-primary">Adicionar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TakeOrder;
