# Storage Analytics POC

A full-stack storage analytics dashboard built with Django REST Framework (backend) and React with Carbon Design System (frontend). This application provides hierarchical drill-down views of storage data across pools, tenants, and volumes.

## 🏗️ Architecture

- **Backend**: Django 5.0.1 + Django REST Framework + PostgreSQL
- **Frontend**: React 18 + Carbon Design System + Chart.js
- **Deployment**: Docker Compose
- **Data Processing**: Pandas + OpenPyXL for Excel parsing

## 📁 Project Structure

```
storage-analytics-poc/
├── docker-compose.yml          # Docker orchestration
├── README.md                   # This file
├── DATA.xlsx                   # Sample data file
├── backend/                    # Django backend
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── manage.py
│   ├── backend/               # Project settings
│   │   ├── settings.py        # Django configuration
│   │   ├── urls.py            # URL routing
│   │   └── ...
│   └── analytics/             # Main app
│       ├── models.py          # Tenant & Volume models
│       ├── views.py           # API endpoints
│       ├── serializers.py     # DRF serializers
│       └── ...
└── frontend/                  # React frontend
    ├── Dockerfile
    ├── package.json
    ├── public/
    └── src/
        ├── App.js             # Main app component
        ├── components/        # React components
        │   ├── Dashboard.js   # Main dashboard with drill-down
        │   ├── Login.js       # Authentication
        │   └── Upload.js      # File upload (admin only)
        ├── services/
        │   └── api.js         # Axios API client
        └── styles/
            └── index.css      # Global styles
```

## 🚀 Quick Start

### Prerequisites

- Docker Desktop installed
- Docker Compose installed
- At least 2GB free RAM

### 1. Start the Application

```bash
# Clone or navigate to project directory
cd /home/user/webapp/ana

# Start all services (database, backend, frontend)
docker-compose up --build
```

This will:
- Start PostgreSQL on port 5432
- Start Django backend on port 8000
- Start React frontend on port 3000
- Run database migrations automatically

### 2. Create Admin User

In a new terminal, create a superuser:

```bash
# Enter the backend container
docker-compose exec backend python manage.py createsuperuser

# Follow the prompts:
# Username: admin
# Email: admin@example.com
# Password: admin (or your choice)
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Swagger Docs**: http://localhost:8000/swagger/
- **Django Admin**: http://localhost:8000/admin/

### 4. Upload Sample Data

1. Login with your admin credentials (admin/admin)
2. Use the upload interface to upload `DATA.xlsx`
3. View the dashboard with hierarchical drill-down

## 📊 Features

### Authentication
- Session-based authentication
- Admin and regular user roles
- Admin-only file upload

### Data Import
- Excel (.xlsx) and CSV file support
- Automatic data parsing and aggregation
- Tenant extraction from volume names
- Data validation and error handling

### Dashboard Views

#### Level 1: Overall Summary
- Total allocated, utilized, and available storage (TB)
- Average utilization across all storage
- Pie chart: Pool utilization distribution
- Bar chart: Top 10 tenants by utilization
- Table: Pool-level metrics (click to drill down)

#### Level 2: Tenant View (by Pool)
- Filter tenants by selected pool
- Table: Tenant-level metrics within pool
- Click tenant to drill down to volumes

#### Level 3: Volume View (by Tenant)
- Filter volumes by selected tenant
- Table: Individual volume details
- System, size, utilization metrics

### Navigation
- Breadcrumb-style back navigation
- Refresh data button
- Logout functionality

## 🛠️ Development

### Backend Development

```bash
# Run Django commands
docker-compose exec backend python manage.py <command>

# Make migrations
docker-compose exec backend python manage.py makemigrations

# Apply migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Django shell
docker-compose exec backend python manage.py shell
```

### Frontend Development

```bash
# Install new packages
docker-compose exec frontend npm install <package>

# View logs
docker-compose logs -f frontend
```

### Database Access

```bash
# Access PostgreSQL
docker-compose exec db psql -U user -d storage_db

# Backup database
docker-compose exec db pg_dump -U user storage_db > backup.sql

# Restore database
docker-compose exec -T db psql -U user storage_db < backup.sql
```

## 🔧 Configuration

### Environment Variables

The application uses environment variables for configuration (set in `docker-compose.yml`):

**Backend:**
- `DATABASE_HOST`: PostgreSQL host (default: db)
- `DATABASE_NAME`: Database name (default: storage_db)
- `DATABASE_USER`: Database user (default: user)
- `DATABASE_PASSWORD`: Database password (default: pass)
- `DATABASE_PORT`: Database port (default: 5432)

**Frontend:**
- `CHOKIDAR_USEPOLLING`: Enable file watching in Docker

### CORS Configuration

CORS is configured in `backend/backend/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

## 📝 API Endpoints

### Authentication
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout

### Data Management
- `POST /api/import/` - Upload and import data file (admin only)
- `GET /api/dashboard/` - Get dashboard data
  - Query params:
    - `pool`: Filter by pool (returns tenants)
    - `tenant`: Filter by tenant (returns volumes)
    - No params: Returns overall summary

### API Documentation
- Swagger UI: http://localhost:8000/swagger/
- ReDoc: http://localhost:8000/redoc/

## 🗄️ Data Model

### Tenant
- `name`: Unique tenant identifier
- `system`: Storage system name
- `child_pool`: Pool assignment
- `allocated_gb`: Total allocated storage
- `utilized_gb`: Total utilized storage
- `left_gb`: Available storage
- `avg_utilization`: Average utilization percentage

### Volume
- `volume`: Volume name
- `tenant`: Foreign key to Tenant
- `system`: Storage system
- `volume_size_gb`: Volume size
- `written_by_host_percent`: Utilization percentage
- `child_pool`: Pool assignment
- `utilized_gb`: Utilized storage
- `left_gb`: Available storage

## 📋 Sample Data Format

The application expects Excel/CSV files with these columns:
- `Volume`: Volume identifier (format: tenant_name_volume_id)
- `System`: Storage system name
- `Volume Size (GB)`: Size in gigabytes
- `Written by Host (%)`: Utilization percentage (0-100)
- `Child Pool` or `Pool`: Pool assignment

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Stop all containers
docker-compose down

# Find and kill processes
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9
lsof -ti:5432 | xargs kill -9
```

### Database Connection Issues
```bash
# Check database health
docker-compose ps

# View backend logs
docker-compose logs backend

# Restart database
docker-compose restart db
```

### Frontend Not Loading
```bash
# Clear node_modules and reinstall
docker-compose down
docker-compose up --build
```

### Data Not Showing
1. Check if you're logged in
2. Ensure data has been uploaded (admin only)
3. Check browser console for errors
4. Verify backend API is accessible: http://localhost:8000/api/dashboard/

## 🔒 Security Notes

⚠️ **This is a POC/Development setup**:
- Uses default Django SECRET_KEY
- DEBUG mode is enabled
- Default database credentials
- No HTTPS
- Session-based auth without additional security layers

**For production:**
- Change SECRET_KEY
- Set DEBUG=False
- Use strong database credentials
- Enable HTTPS
- Add rate limiting
- Implement JWT or OAuth2
- Use environment variables for secrets
- Add proper logging and monitoring

## 🛑 Stopping the Application

```bash
# Stop containers (keep data)
docker-compose down

# Stop and remove volumes (delete data)
docker-compose down -v

# Stop and remove everything
docker-compose down -v --rmi all
```

## 📦 Technology Stack

### Backend
- Django 5.0.1
- Django REST Framework 3.14.0
- PostgreSQL 13
- Pandas 2.1.4
- OpenPyXL 3.1.2
- drf-yasg 1.21.7 (Swagger)
- django-cors-headers 4.3.1

### Frontend
- React 18.2.0
- Carbon Design System 1.0.0
- Chart.js 4.4.1
- Axios 1.6.5
- React Scripts 5.0.1

### Infrastructure
- Docker & Docker Compose
- PostgreSQL 13

## 🎯 Future Enhancements

- [ ] Export data to Excel/CSV
- [ ] Advanced filtering and search
- [ ] Historical data tracking
- [ ] Alerting for utilization thresholds
- [ ] Multi-file upload support
- [ ] Data validation rules
- [ ] User management interface
- [ ] API rate limiting
- [ ] Comprehensive test coverage
- [ ] CI/CD pipeline
- [ ] Production deployment guide

## 📄 License

This is a POC project. Add appropriate license as needed.

## 👥 Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Review Swagger docs: http://localhost:8000/swagger/
3. Check browser console for frontend errors

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-20
