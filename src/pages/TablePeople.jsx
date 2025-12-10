import { useParams, useNavigate } from 'react-router-dom';
import { api, supabase } from '../services/api';
import { ArrowLeft, UserPlus, Search, Receipt, CheckCircle, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const TablePeople = () => {
    const { id } = useParams(); // Start using ID as table ID
    const navigate = useNavigate();
    const [table, setTable] = useState(null);
    const [loading, setLoading] = useState(true);

    // Local state for adding people (Mock for now as backend doesn't support Guest List yet)
    const [mode, setMode] = useState('view'); // view, add-guest, add-cpf
    const [inputValue, setInputValue] = useState('');

    const loadTable = async () => {
        try {
            const data = await api.getTable(id);
            setTable(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTable();
        // Realtime Subscription for this table
        const channel = supabase
            .channel(`table-${id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `table_id=eq.${id}` }, () => loadTable())
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [id]);

    const [serviceFeeOption, setServiceFeeOption] = useState(10); // 8, 10, or 13

    if (loading) return <div className="container">Carregando...</div>;
    if (!table) return <div className="container">Mesa não encontrada</div>;

    const activeOrders = table.orders || [];
    const subtotal = activeOrders.reduce((acc, o) => acc + (o.price * o.quantity), 0);

    // Group orders by person
    const ordersByPerson = activeOrders.reduce((acc, order) => {
        const person = order.ordered_by || 'Desconhecido';
        if (!acc[person]) acc[person] = [];
        acc[person].push(order);
        return acc;
    }, {});

    // Calculate Fees
    const peopleCount = Object.keys(ordersByPerson).length || 1;
    const appFeeTotal = peopleCount * 1.99; // 1.99 per person/checkout
    const serviceFee = subtotal * (serviceFeeOption / 100);
    const total = subtotal + serviceFee + appFeeTotal;

    const handleClearTable = async () => {
        if (confirm(`Total Final: R$ ${total.toFixed(2)}\nDeseja fechar a conta da Mesa ${table.number} e liberar a mesa?`)) {
            // In a real app we would archive orders. For MVP we might just delete them or mark as paid.
            // For now, let's just alert.
            alert('Mesa liberada! (Simulação)');
            navigate('/');
        }
    };

    // Helper to resolve Call Waiter
    const callWaiterItem = activeOrders.find(o => o.name === '🔔 CHAMAR GARÇOM');
    const handleResolveCall = async () => {
        if (callWaiterItem) {
            // Delete the item to "resolve" it
            await supabase.from('orders').delete().eq('id', callWaiterItem.id);
            alert('Solicitação atendida!');
            loadTable();
        }
    };

    return (
        <div className="container" style={{ padding: 0 }}>
            {/* Fixed Header */}
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
                    <h2>Mesa {table.number}</h2>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                    R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
            </header>

            {/* Spacer for Header */}
            <div style={{ height: '80px' }}></div>

            <div style={{ padding: '1rem' }}>
                {callWaiterItem && (
                    <div className="card pulse" style={{ backgroundColor: '#ef4444', color: 'white', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>🔔 Cliente chamando!</span>
                        <button onClick={handleResolveCall} className="btn-ghost" style={{ background: 'white', color: '#ef4444', padding: '0.5rem 1rem' }}>
                            Atender
                        </button>
                    </div>
                )}

                {/* List of People / Orders */}
                <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                    {Object.keys(ordersByPerson).length > 0 ? (
                        Object.entries(ordersByPerson).map(([person, orders]) => {
                            const personSubtotal = orders.reduce((a, b) => a + (b.price * b.quantity), 0);
                            const personServiceFee = personSubtotal * (serviceFeeOption / 100);
                            const personAppFee = 1.99;
                            const personTotal = personSubtotal + personServiceFee + personAppFee;

                            return (
                                <div key={person} className="card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                                        <h4 style={{ textTransform: 'capitalize' }}>{person}</h4>
                                        <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>
                                            R$ {personTotal.toFixed(2)}
                                        </span>
                                    </div>

                                    {orders.map(order => (
                                        <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                            <span style={{ color: order.name.includes('CHAMAR GARÇOM') ? '#ef4444' : '#cbd5e1' }}>
                                                {order.quantity}x {order.name}
                                            </span>
                                            <span>{order.price.toFixed(2)}</span>
                                        </div>
                                    ))}

                                    <div style={{ borderTop: '1px dashed #333', marginTop: '0.5rem', paddingTop: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Subtotal</span>
                                            <span>{personSubtotal.toFixed(2)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Serviço ({serviceFeeOption}%)</span>
                                            <span>{personServiceFee.toFixed(2)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Taxa App</span>
                                            <span>{personAppFee.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Nenhum pedido ainda.</p>
                    )}
                </div>

                {/* Totals & Fees */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#94a3b8' }}>Subtotal</span>
                        <span>R$ {subtotal.toFixed(2)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                        <span style={{ color: '#94a3b8' }}>Taxa de Serviço</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {[8, 10, 13].map(pct => (
                                <button
                                    key={pct}
                                    onClick={() => setServiceFeeOption(pct)}
                                    style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '8px',
                                        border: '1px solid #334155',
                                        backgroundColor: serviceFeeOption === pct ? 'var(--primary)' : 'transparent',
                                        color: serviceFeeOption === pct ? 'black' : 'white',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    {pct}%
                                </button>
                            ))}
                        </div>
                        {/* Fixed Display for width consistency */}
                        <span style={{ width: '80px', textAlign: 'right' }}>R$ {serviceFee.toFixed(2)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: '#94a3b8' }}>Taxa do App ({peopleCount}x)</span>
                        <span>R$ {appFeeTotal.toFixed(2)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #333', fontSize: '1.25rem', fontWeight: 'bold' }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--success)' }}>R$ {total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Spacer to prevent content from being hidden behind fixed footer */}
                <div style={{ height: '200px' }}></div>
            </div>

            {/* Actions Footer - Fixed Bottom */}
            <div style={{
                position: 'fixed', bottom: '65px', left: 0, right: 0,
                backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid #333',
                padding: '1rem', display: 'grid', gap: '1rem',
                zIndex: 90, maxWidth: '480px', margin: '0 auto',
                borderRadius: '16px 16px 0 0', boxShadow: '0 -4px 10px rgba(0,0,0,0.3)'
            }}>
                <button onClick={() => navigate(`/take-order/${table.id}`)} className="btn btn-primary btn-lg">
                    <UserPlus size={24} />
                    Adicionar Pedido
                </button>

                <button onClick={handleClearTable} className="btn btn-danger btn-lg">
                    <CheckCircle size={24} />
                    Fechar Conta / Liberar Mesa
                </button>
            </div>
        </div>
    );
};

export default TablePeople;
