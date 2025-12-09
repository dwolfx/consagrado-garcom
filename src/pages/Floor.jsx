import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, supabase } from '../services/api';
import { Bell, User, ChevronRight } from 'lucide-react';

const Floor = () => {
    const navigate = useNavigate();
    const [tables, setTables] = useState([]);

    useEffect(() => {
        const load = async () => {
            const data = await api.getTables();
            // Process tables to add helper flags
            const processed = data.map(t => ({
                ...t,
                callWaiter: t.orders?.some(o => o.name === '🔔 CHAMAR GARÇOM' && o.status !== 'completed'),
                total: t.orders?.reduce((acc, o) => acc + (o.price * o.quantity), 0) || 0,
                peopleCount: t.orders?.reduce((acc, o) => {
                    // Rough estimate of people based on unique orderers or just default
                    const unique = new Set(t.orders.map(or => or.ordered_by));
                    return unique.size || 0;
                }, 0)
            }));
            setTables(processed);
        };
        load();

        // Realtime Subscription
        const channel = supabase
            .channel('waiter-floor')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tables' }, () => load())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => load())
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    // Sort: Calling waiter -> Occupied -> Free
    const sortedTables = [...tables].sort((a, b) => {
        if (a.callWaiter && !b.callWaiter) return -1;
        if (!a.callWaiter && b.callWaiter) return 1;
        if (a.status === 'occupied' && b.status === 'free') return -1;
        if (a.status === 'free' && b.status === 'occupied') return 1;
        return a.number - b.number;
    });

    const waiter = JSON.parse(localStorage.getItem('waiter_user') || '{}');

    return (
        <div className="container">
            <header className="header" style={{ marginBottom: '1.5rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Salão</h1>
                    <p style={{ opacity: 0.8 }}>Visão Geral</p>
                </div>
                <div
                    onClick={() => navigate('/profile')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#334155',
                        padding: '0.5rem 1rem', borderRadius: '24px', cursor: 'pointer'
                    }}
                >
                    <User size={20} />
                    <span style={{ fontWeight: 'bold' }}>{waiter.name || 'Garçom'}</span>
                </div>
            </header>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {sortedTables.map(table => (
                    <div
                        key={table.id}
                        className={`card table-item ${table.callWaiter ? 'calling' : ''}`}
                        onClick={() => navigate(table.status === 'free' ? `/take-order/${table.id}` : `/people/${table.id}`)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div className={`status-indicator ${table.status}`}>
                                    {table.number}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem' }}>Mesa {table.number}</h3>
                                    <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                                        {table.status === 'free' ? 'Livre' : `${table.peopleCount || 2} Pessoas • R$ ${table.total.toFixed(2)}`}
                                    </div>
                                </div>
                            </div>

                            {table.callWaiter ? (
                                <div className="pulse" style={{ backgroundColor: '#ef4444', padding: '0.5rem', borderRadius: '50%' }}>
                                    <Bell size={24} color="white" />
                                </div>
                            ) : (
                                <ChevronRight size={24} color="#475569" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Floor;
