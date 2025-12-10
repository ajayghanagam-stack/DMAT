# MinIO Setup Guide (without Docker)

This guide explains how to set up and run MinIO locally without Docker for the DMAT project.

## What is MinIO?

MinIO is an open-source, S3-compatible object storage system. We use it to store uploaded images for landing pages.

## Setup Instructions

### 1. Download and Run MinIO

We've provided a setup script that automatically downloads MinIO and runs it:

```bash
./setup-minio.sh
```

This script will:
- Download the MinIO binary for your OS (macOS or Linux)
- Create a storage directory at `./minio-storage`
- Start the MinIO server on port 9000 (API) and 9001 (Console)

### 2. Access MinIO Console

Once MinIO is running, you can access:

- **API Endpoint**: http://localhost:9000
- **Web Console**: http://localhost:9001

**Login Credentials:**
- Username: `minioadmin`
- Password: `minioadmin123`

### 3. Automatic Bucket Creation

The backend automatically creates the `dmat-images` bucket when it starts. No manual configuration needed!

## Starting MinIO for Development

### Option 1: Using the setup script (recommended)

```bash
./setup-minio.sh
```

This will start MinIO in the foreground. Keep this terminal window open.

### Option 2: Running in background

```bash
# Start MinIO in background
./bin/minio server ./minio-storage --console-address ":9001" &

# To stop, find the process and kill it
pkill minio
```

## Directory Structure

```
DMAT/
├── setup-minio.sh          # Setup and run script
├── bin/
│   └── minio               # MinIO binary (auto-downloaded)
└── minio-storage/          # Storage directory for uploaded files
    └── dmat-images/        # Bucket for images (auto-created)
```

## Environment Variables

The backend is pre-configured with these MinIO settings in `.env`:

```bash
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET=dmat-images
```

## Testing Image Upload

1. Start MinIO: `./setup-minio.sh`
2. Start the backend: `cd backend && node server.js`
3. Start the frontend: `cd frontend && npm run dev`
4. Navigate to Landing Pages → Create/Edit
5. Upload an image in the Hero Image section
6. The image will be stored in MinIO and accessible via URL

## Troubleshooting

### MinIO won't start
- **Port already in use**: Make sure ports 9000 and 9001 are not in use
- **Permission denied**: Run `chmod +x setup-minio.sh`

### Backend can't connect to MinIO
- Make sure MinIO is running on http://localhost:9000
- Check the backend logs for MinIO connection errors
- Verify the credentials in `.env` match MinIO's settings

### Images not uploading
- Check browser console for errors
- Verify file size is under 5MB
- Ensure file type is JPG, PNG, GIF, or WebP
- Check backend logs for detailed error messages

## Production Deployment

For production, consider:

1. **Security**:
   - Change `MINIO_ACCESS_KEY` and `MINIO_SECRET_KEY`
   - Enable SSL/TLS (`MINIO_USE_SSL=true`)
   - Use a reverse proxy (nginx/Apache)

2. **Persistence**:
   - Back up the `minio-storage` directory regularly
   - Consider using a cloud storage backend

3. **Performance**:
   - Use a dedicated server/VM for MinIO
   - Configure appropriate resource limits
   - Enable caching and CDN if needed

## Alternative: Docker Setup

If you prefer Docker, use the provided `docker-compose.yml`:

```bash
docker-compose up -d minio
```

This will start MinIO in a Docker container with persistent storage.
