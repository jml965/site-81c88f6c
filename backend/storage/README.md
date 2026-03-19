# Storage Directory

This directory contains various storage systems and configurations for the Mazad Motion platform.

## Directory Structure

```
storage/
├── cache/              # Application cache files
│   ├── redis/          # Redis cache dumps
│   ├── sessions/       # User session storage
│   └── temp/           # Temporary cache files
├── logs/               # Application logs
│   ├── app/            # General application logs
│   ├── error/          # Error logs
│   ├── access/         # Access logs
│   ├── audit/          # Audit logs
│   └── performance/    # Performance monitoring logs
├── backups/            # Database and file backups
│   ├── database/       # Database backups
│   ├── files/          # File system backups
│   └── configs/        # Configuration backups
├── exports/            # Data export files
│   ├── auctions/       # Auction data exports
│   ├── users/          # User data exports
│   └── reports/        # Report exports
├── imports/            # Data import staging
│   ├── pending/        # Files awaiting import
│   ├── processing/     # Files being processed
│   └── completed/      # Successfully imported files
└── queue/              # Job queue storage
    ├── pending/        # Pending jobs
    ├── processing/     # Currently processing jobs
    └── failed/         # Failed job data
```

## Cache System

### Redis Cache
- **Location**: `cache/redis/`
- **Purpose**: Session storage, real-time data, API responses
- **Retention**: 7 days for general cache, 30 days for sessions
- **Size limit**: 2GB

### Session Storage
- **Location**: `cache/sessions/`
- **Format**: JSON files or Redis storage
- **Retention**: 24 hours for inactive sessions
- **Security**: Encrypted session data

### Temporary Cache
- **Location**: `cache/temp/`
- **Purpose**: Short-term data storage
- **Retention**: 1 hour
- **Auto-cleanup**: Every 30 minutes

## Logging System

### Log Levels
- **ERROR**: Critical errors requiring immediate attention
- **WARN**: Warning messages for potential issues
- **INFO**: General information about application flow
- **DEBUG**: Detailed debugging information

### Log Rotation
- **Daily rotation**: Logs rotated daily at midnight
- **Size limit**: 100MB per log file
- **Retention**: 30 days for regular logs, 90 days for audit logs
- **Compression**: Logs older than 7 days are compressed

### Application Logs (`logs/app/`)
```
app-2023-12-01.log      # General application logs
app-2023-12-01.log.gz   # Compressed older logs
```

### Error Logs (`logs/error/`)
```
error-2023-12-01.log    # Error and exception logs
fatal-2023-12-01.log    # Fatal error logs
```

### Access Logs (`logs/access/`)
```
access-2023-12-01.log   # HTTP access logs
api-2023-12-01.log      # API access logs
```

### Audit Logs (`logs/audit/`)
```
audit-2023-12-01.log    # Security audit logs
auth-2023-12-01.log     # Authentication logs
bid-2023-12-01.log      # Bidding activity logs
admin-2023-12-01.log    # Admin action logs
```

### Performance Logs (`logs/performance/`)
```
performance-2023-12-01.log  # Performance metrics
query-2023-12-01.log        # Database query performance
api-2023-12-01.log          # API response times
```

## Backup System

### Database Backups (`backups/database/`)
- **Frequency**: Every 6 hours for full backup, every hour for incremental
- **Format**: SQL dumps compressed with gzip
- **Naming**: `mazad_backup_YYYY-MM-DD_HH-MM-SS.sql.gz`
- **Retention**: 30 days local, 1 year cloud storage
- **Encryption**: AES-256 encryption for cloud backups

### File Backups (`backups/files/`)
- **Frequency**: Daily incremental, weekly full backup
- **Scope**: User uploads, configuration files, logs
- **Format**: TAR archives with compression
- **Naming**: `files_backup_YYYY-MM-DD.tar.gz`
- **Verification**: Automatic integrity checks

### Configuration Backups (`backups/configs/`)
- **Frequency**: Before any configuration change
- **Scope**: Environment files, server configs, application settings
- **Format**: JSON or original format
- **Naming**: `config_backup_YYYY-MM-DD_HH-MM-SS.json`
- **Version control**: Git-based versioning for configs

## Data Export System

### Auction Exports (`exports/auctions/`)
- **Format**: CSV, JSON, Excel
- **Data**: Auction details, bid history, participant data
- **Scheduling**: On-demand or scheduled exports
- **Access control**: Admin and seller access levels

### User Exports (`exports/users/`)
- **Format**: CSV, JSON (GDPR compliant)
- **Data**: User profiles, activity history, preferences
- **Privacy**: Personal data anonymization options
- **Compliance**: GDPR data portability requirements

### Report Exports (`exports/reports/`)
- **Format**: PDF, Excel, CSV
- **Types**: Financial reports, activity reports, analytics
- **Scheduling**: Automated daily/weekly/monthly reports
- **Distribution**: Email delivery to stakeholders

## Data Import System

### Import Process
1. **Upload**: Files uploaded to `imports/pending/`
2. **Validation**: Move to `imports/processing/` for validation
3. **Processing**: Data transformation and import
4. **Completion**: Move to `imports/completed/` with results

### Supported Formats
- CSV (UTF-8 with BOM support)
- JSON (structured data)
- Excel (.xlsx, .xls)
- XML (structured data)

### Import Types
- **User data**: Bulk user registration
- **Auction data**: Auction item catalogs
- **Category data**: Product categories and metadata
- **Configuration**: System settings and parameters

## Job Queue System

### Queue Types
- **Email queue**: Email sending jobs
- **Media processing**: Video/image processing jobs
- **Export queue**: Data export generation
- **Notification queue**: Push notification delivery
- **Cleanup queue**: Maintenance and cleanup tasks

### Job Processing
- **Workers**: 4 concurrent workers per queue type
- **Retry logic**: 3 attempts with exponential backoff
- **Timeout**: 5 minutes per job
- **Monitoring**: Real-time job status tracking

## Storage Monitoring

### Disk Usage Alerts
```bash
# Alert thresholds
WARNING: 80% disk usage
CRITICAL: 90% disk usage
EMERGENCY: 95% disk usage
```

### Monitoring Metrics
- **Disk space usage**: Per directory monitoring
- **File count**: Number of files per directory
- **Growth rate**: Storage growth over time
- **I/O performance**: Read/write performance metrics

## Security Measures

### File Permissions
```bash
# Directory permissions
drwx------ storage/cache/          # 700 (owner only)
drwxr-x--- storage/logs/           # 750 (owner + group read)
drwx------ storage/backups/        # 700 (owner only)
drwxr-xr-- storage/exports/        # 754 (others read only)

# File permissions
-rw------- *.log                   # 600 (owner read/write)
-rw-r----- *.backup               # 640 (owner write, group read)
-rw-r--r-- *.export               # 644 (others read)
```

### Encryption
- **Backup encryption**: AES-256 for offsite backups
- **Log encryption**: Sensitive logs encrypted at rest
- **Export encryption**: User data exports encrypted
- **Key management**: Separate key storage and rotation

## Maintenance Tasks

### Daily Tasks
```bash
#!/bin/bash
# Daily maintenance script

# Clean up temporary files
find storage/cache/temp -type f -mtime +1 -delete

# Rotate logs
logrotate /etc/logrotate.d/mazad

# Backup database
pg_dump mazad_db | gzip > storage/backups/database/mazad_backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Clean old backups (keep 30 days)
find storage/backups/database -name "*.sql.gz" -mtime +30 -delete

# Process pending imports
node scripts/process-imports.js

# Generate daily reports
node scripts/generate-daily-reports.js
```

### Weekly Tasks
```bash
#!/bin/bash
# Weekly maintenance script

# Full file backup
tar -czf storage/backups/files/files_backup_$(date +%Y%m%d).tar.gz uploads/ storage/

# Clean old logs
find storage/logs -name "*.log.gz" -mtime +30 -delete

# Optimize cache
redis-cli FLUSHEXPIRED

# Generate weekly reports
node scripts/generate-weekly-reports.js

# Security audit
node scripts/security-audit.js
```

### Monthly Tasks
```bash
#!/bin/bash
# Monthly maintenance script

# Archive old data
node scripts/archive-old-auctions.js

# Clean up exports
find storage/exports -type f -mtime +90 -delete

# Update storage statistics
node scripts/update-storage-stats.js

# Generate monthly reports
node scripts/generate-monthly-reports.js

# Backup verification
node scripts/verify-backups.js
```

## Environment Variables

```bash
# Storage paths
STORAGE_PATH=/app/storage
CACHE_PATH=/app/storage/cache
LOG_PATH=/app/storage/logs
BACKUP_PATH=/app/storage/backups

# Cache settings
CACHE_TTL=3600              # 1 hour default TTL
SESSION_TTL=86400           # 24 hours session TTL
REDIS_URL=redis://localhost:6379

# Log settings
LOG_LEVEL=info
LOG_MAX_SIZE=100MB
LOG_MAX_FILES=30
LOG_COMPRESS=true

# Backup settings
BACKUP_ENABLED=true
BACKUP_COMPRESSION=gzip
BACKUP_ENCRYPTION=true
BACKUP_CLOUD_PROVIDER=aws_s3
BACKUP_RETENTION_DAYS=30

# Queue settings
QUEUE_WORKERS=4
QUEUE_MAX_RETRIES=3
QUEUE_TIMEOUT=300000        # 5 minutes

# Monitoring
MONITORING_ENABLED=true
DISK_WARNING_THRESHOLD=80
DISK_CRITICAL_THRESHOLD=90
```

## Troubleshooting

### Common Issues

1. **Disk space full**
   ```bash
   # Check disk usage
   df -h /app/storage
   
   # Clean up temp files
   find storage/cache/temp -type f -delete
   
   # Compress old logs
   gzip storage/logs/app/*.log
   ```

2. **Backup failures**
   ```bash
   # Check backup logs
   tail -f storage/logs/app/backup.log
   
   # Test database connection
   pg_isready -d mazad_db
   
   # Manual backup
   pg_dump mazad_db > manual_backup.sql
   ```

3. **Queue processing stuck**
   ```bash
   # Check queue status
   redis-cli llen queue:pending
   
   # Restart queue workers
   pm2 restart queue-workers
   
   # Clear failed jobs
   redis-cli del queue:failed
   ```

### Performance Optimization

1. **Log performance**
   - Use asynchronous logging
   - Implement log buffering
   - Regular log rotation
   - Compress old logs

2. **Cache optimization**
   - Monitor cache hit rates
   - Optimize cache keys
   - Implement cache warming
   - Regular cache cleanup

3. **Storage optimization**
   - Use SSD for frequently accessed data
   - Implement data tiering
   - Regular defragmentation
   - Monitor I/O patterns