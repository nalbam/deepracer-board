import React, { useState } from 'react'
import AppContext from './AppContext'

const AppProvider = ({children}) => {

    const incrementItems = () => {
        setAppContext(prevState => {
            return {
                ...prevState,
                cart: {itemCount: prevState.cart.itemCount + 1}
            }
        })
    }

    const addItemToCart = (item, quantity) => {
        setAppContext(prevState => {
            var newItems = Object.assign({}, prevState)
            newItems.cart.items.push({id: item.id, quantity: quantity})
            return {
                ...prevState,
                cart: {items: newItems.cart.items}
            }
        })
    }

    const addItems = (items) => {
        setAppContext(prevState => {
            return {
                ...prevState,
                items
            }
        })
    }

    const storeUser = (user) => {
        setAppContext(prevState => {
            return {
                ...prevState,
                user
            }
        })
    }

    const clearCart = () => {
        setAppContext(prevState => {
            return {
                ...prevState,
                cart: {items: []}
            }
        })
    }

    const appState = {
        cart: {items: []},
        items: [],
        user: null,
        addItemToCart,
        incrementItems,
        addItems,
        storeUser,
        clearCart
    }

    const [appContext, setAppContext] = useState(appState)

    return (
        <AppContext.Provider value={appContext}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
