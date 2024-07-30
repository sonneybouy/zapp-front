import React, { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';

const ADD_INVENTORY = gql`
  mutation AddInventory($quantity: Int!, $sku: String!, $description: String, $store: String!) {
    createInventory(quantity: $quantity, sku: $sku, description: $description, store: $store) {
      id
      quantity
      sku
      description
      store
    }
  }
`;

const GET_INVENTORIES = gql`
  query GetInventories {
    inventories {
      id
      sku
      store
    }
  }
`;

const AddInventoryItem: React.FC = () => {
    const [quantity, setQuantity] = useState('');
    const [sku, setSku] = useState('');
    const [description, setDescription] = useState('');
    const [store, setStore] = useState('');
    const [error, setError] = useState<string | null>(null);

    const { data: inventoryData } = useQuery(GET_INVENTORIES);

    const [addInventory, { loading }] = useMutation(ADD_INVENTORY, {
        refetchQueries: ['GetInventories'],
        onError: (error) => {
            setError(`Failed to add item: ${error.message}`);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Check if SKU-store pair already exists
        if (inventoryData && inventoryData.inventories.some(
            (item: { sku: string, store: string }) => item.sku === sku && item.store === store
        )) {
            setError('This SKU already exists in the specified store. Please use a unique SKU-store combination.');
            return;
        }

        addInventory({
            variables: {
                quantity: parseInt(quantity),
                sku,
                description,
                store,
            },
        }).then(() => {
            // Reset form on success
            setQuantity('');
            setSku('');
            setDescription('');
            setStore('');
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
                required
            />
            <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="SKU"
                required
            />
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
            />
            <input
                type="text"
                value={store}
                onChange={(e) => setStore(e.target.value)}
                placeholder="Store"
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Item'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default AddInventoryItem;