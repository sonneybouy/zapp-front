import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import CSVUpload from './components/CSVUpload';
import InventoryList from './components/InventoryList';
import AddInventoryItem from './components/AddInventoryItem';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache()
});

function App() {
    return (
        <ApolloProvider client={client}>
            <div className="App">
                <h1>Inventory Management</h1>
                <CSVUpload />
                <AddInventoryItem />
                <InventoryList />
            </div>
        </ApolloProvider>
    );
}

export default App;