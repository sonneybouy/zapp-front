import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_INVENTORIES = gql`
  query GetInventories {
    inventories {
      id
      quantity
      sku
      description
      store
    }
  }
`;

const UPDATE_INVENTORY = gql`
  mutation UpdateInventory($id: Int!, $quantity: Int, $sku: String, $description: String, $store: String) {
    updateInventory(id: $id, quantity: $quantity, sku: $sku, description: $description, store: $store) {
      id
      quantity
      sku
      description
      store
    }
  }
`;

const DELETE_INVENTORY = gql`
  mutation DeleteInventory($id: Int!) {
    deleteInventory(id: $id) {
      id
    }
  }
`;

interface Inventory {
    id: number;
    quantity: number;
    sku: string;
    description: string | null;
    store: string;
}

const InventoryList: React.FC = () => {
    const { loading, error, data } = useQuery(GET_INVENTORIES);
    const [updateInventory] = useMutation(UPDATE_INVENTORY);
    const [deleteInventory] = useMutation(DELETE_INVENTORY, {
        refetchQueries: ['GetInventories'],
    });

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Inventory | null>(null);
    const [editError, setEditError] = useState<string | null>(null);

    useEffect(() => {
        if (editingId === null) {
            setEditError(null);
        }
    }, [editingId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const handleEdit = (item: Inventory) => {
        setEditingId(item.id);
        setEditForm(item);
    };

    const handleUpdate = async () => {
        if (editForm) {
            // Check if the SKU-store pair already exists (excluding the current item)
            const skuStoreExists = data.inventories.some(
                (item: Inventory) =>
                    item.sku === editForm.sku &&
                    item.store === editForm.store &&
                    item.id !== editForm.id
            );

            if (skuStoreExists) {
                setEditError('This SKU already exists in the specified store. Please use a unique SKU-store combination.');
                return;
            }

            try {
                await updateInventory({
                    variables: {
                        id: editForm.id,
                        quantity: editForm.quantity,
                        sku: editForm.sku,
                        description: editForm.description,
                        store: editForm.store,
                    },
                });
                setEditingId(null);
                setEditForm(null);
                setEditError(null);
            } catch (error) {
                setEditError('An error occurred while updating. Please try again.');
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteInventory({
                    variables: { id },
                });
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    return (
        <table>
            <thead>
            <tr>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Description</th>
                <th>Store</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {data.inventories.map((item: Inventory) => (
                <tr key={item.id}>
                    {editingId === item.id ? (
                        <>
                            <td>
                                <input
                                    value={editForm?.sku || ''}
                                    onChange={(e) => setEditForm({ ...editForm!, sku: e.target.value })}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={editForm?.quantity || 0}
                                    onChange={(e) => setEditForm({ ...editForm!, quantity: parseInt(e.target.value) })}
                                />
                            </td>
                            <td>
                                <input
                                    value={editForm?.description || ''}
                                    onChange={(e) => setEditForm({ ...editForm!, description: e.target.value })}
                                />
                            </td>
                            <td>
                                <input
                                    value={editForm?.store || ''}
                                    onChange={(e) => setEditForm({ ...editForm!, store: e.target.value })}
                                />
                            </td>
                            <td>
                                <button onClick={handleUpdate}>Save</button>
                                <button onClick={() => {
                                    setEditingId(null);
                                    setEditError(null);
                                }}>Cancel</button>
                                {editError && <p style={{ color: 'red' }}>{editError}</p>}
                            </td>
                        </>
                    ) : (
                        <>
                            <td>{item.sku}</td>
                            <td>{item.quantity}</td>
                            <td>{item.description}</td>
                            <td>{item.store}</td>
                            <td>
                                <button onClick={() => handleEdit(item)}>Edit</button>
                                <button onClick={() => handleDelete(item.id)}>Delete</button>
                            </td>
                        </>
                    )}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default InventoryList;