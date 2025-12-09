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

    if (loading) return <div className="container">Carregando...</div>;
    if (!table) return <div className="container">Mesa não encontrada</div>;

    const activeOrders = table.orders || [];
    const total = activeOrders.reduce((acc, o) => acc + (o.price * o.quantity), 0);

    // Group orders by person
    const ordersByPerson = activeOrders.reduce((acc, order) => {
        const person = order.ordered_by || 'Desconhecido';
        if (!acc[person]) acc[person] = [];
        acc[person].push(order);
        return acc;
    }, {});

    const handleClearTable = async () => {
        if (confirm(`Deseja fechar a conta da Mesa ${table.number} e liberar a mesa?`)) {
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
        <div className="container">
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate(-1)} className="btn-outline" style={{ width: 'auto', padding: '0.5rem' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <h2>Mesa {table.number}</h2>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                    R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
            </header>

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
                    Object.entries(ordersByPerson).map(([person, orders]) => (
                        <div key={person} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                                <h4 style={{ textTransform: 'capitalize' }}>{person}</h4>
                                <span style={{ color: '#94a3b8' }}>
                                    R$ {orders.reduce((a, b) => a + (b.price * b.quantity), 0).toFixed(2)}
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
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Nenhum pedido ainda.</p>
                )}
            </div>

            {/* Actions Area */}
            <div style={{ display: 'grid', gap: '1rem', marginTop: 'auto' }}>
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
