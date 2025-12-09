
// Shared logic from B2B/B2C
export const tables = [
    { id: 1, number: 1, status: 'free', people: [] },
    {
        id: 2,
        number: 2,
        status: 'occupied',
        total: 135.00,
        openSince: '20:00',
        people: [
            { id: 'u1', name: 'João Silva', type: 'app', avatar: '🧔' },
            { id: 'u2', name: 'Maria Oliveira', type: 'app', avatar: '👩‍🦱' },
            { id: 'g1', name: 'Convidado 1', type: 'guest', avatar: '👤' }
        ]
    },
    {
        id: 3,
        number: 3,
        status: 'calling',
        total: 45.00,
        openSince: '21:15',
        people: [
            { id: 'u3', name: 'Carlos Santos', type: 'app', avatar: '👨' }
        ]
    },
    { id: 4, number: 4, status: 'free', people: [] },
    {
        id: 5,
        number: 5,
        status: 'occupied',
        total: 280.50,
        openSince: '19:45',
        people: [
            { id: 'g2', name: 'Turista 1', type: 'guest', avatar: '👤' },
            { id: 'g3', name: 'Turista 2', type: 'guest', avatar: '👤' }
        ]
    },
    { id: 6, number: 6, status: 'free', people: [] },
];

export const products = [
    { id: 1, name: "Heineken 600ml", price: 18.00, category: "Cervejas" },
    { id: 2, name: "Batata Frita", price: 35.00, category: "Porções" },
    { id: 3, name: "Caipirinha", price: 25.00, category: "Drinks" },
    { id: 4, name: "Água sem Gás", price: 6.00, category: "Sem Álcool" },
    { id: 5, name: "Coca-Cola", price: 8.00, category: "Sem Álcool" },
    { id: 6, name: "Gin Tônica", price: 30.00, category: "Drinks" },
];
