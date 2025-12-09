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
            setTables(data);
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

    return (
        <div className="container">
            <header className="header">
                <div>
                    <h1>Salão</h1>
                    <p style={{ opacity: 0.8 }}>Visão Geral</p>
                </div>
                <div style={{ backgroundColor: '#334155', padding: '0.5rem', borderRadius: '50%' }}>
                    <User size={24} />
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
                                        {table.status === 'free' ? 'Livre' : `${table.people?.length || 2} Pessoas • R$ ${(table.orders?.reduce((acc, o) => acc + o.price, 0) || 0).toFixed(2)}`}
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
