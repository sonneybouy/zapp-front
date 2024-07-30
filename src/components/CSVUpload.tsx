import React, { useState } from 'react';

const CSVUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:4000/upload-csv', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            console.log(data);
            alert(`Successfully imported ${data.count} items`);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button type="submit" disabled={!file}>Upload CSV</button>
        </form>
    );
};

export default CSVUpload;