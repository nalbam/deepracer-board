import React from 'react'

const AppContext = React.createContext({
    cart: {itemCount: 0},
    items: [],
    user: null,
    clearCart: () => {},
    addItemToCart: (item, quantity) => {},
    addItems: (items) => {},
    storeUser: (user) => {}
});

export default AppContext
