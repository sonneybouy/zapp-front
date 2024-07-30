# Zapp Inventory Management - Frontend

This is the frontend for the Zapp Inventory Management system.

## Cloud Deployment

To deploy this frontend to the cloud:

1. Build the project: `npm run build`
2. 
2. Upload the contents of the `build` or `dist` directory to a cloud storage service (e.g., AWS S3, Google Cloud Storage, Azure Blob Storage).

3. Configure the storage bucket for static website hosting. (optional, we don't have any assets yet)

4. Set up a Content Delivery Network (CDN) pointing to your storage bucket for improved performance. (again, optional)

5. Configure HTTPS using the cloud provider's SSL/TLS certificate service.

6. Update any environment variables or configuration files with the backend API URL.

7.  Set up a CI/CD pipeline to automate the build and deployment process.
