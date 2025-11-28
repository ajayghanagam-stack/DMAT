#!/bin/bash

# ============================================================================
# DMAT Database Setup Script
# Description: Automated database creation and migration
# Author: DMAT Team
# Date: 2025-11-28
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration (can be overridden by environment variables)
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-dmat_db}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-}"

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIGRATIONS_DIR="$SCRIPT_DIR/migrations"

# ============================================================================
# Helper Functions
# ============================================================================

print_header() {
    echo -e "\n${BLUE}================================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# ============================================================================
# Check Prerequisites
# ============================================================================

check_prerequisites() {
    print_header "Checking Prerequisites"

    # Check if psql is installed
    if ! command -v psql &> /dev/null; then
        print_error "PostgreSQL client (psql) is not installed"
        exit 1
    fi
    print_success "PostgreSQL client found: $(psql --version)"

    # Check if PostgreSQL is running
    if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" &> /dev/null; then
        print_error "PostgreSQL is not running on $DB_HOST:$DB_PORT"
        print_info "Start PostgreSQL and try again"
        exit 1
    fi
    print_success "PostgreSQL is running on $DB_HOST:$DB_PORT"
}

# ============================================================================
# Create Database
# ============================================================================

create_database() {
    print_header "Creating Database"

    # Check if database already exists
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
        print_warning "Database '$DB_NAME' already exists"
        read -p "Do you want to drop and recreate it? (yes/no): " -r
        if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            print_info "Dropping existing database..."
            psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "DROP DATABASE $DB_NAME;"
            print_success "Database dropped"
        else
            print_info "Skipping database creation"
            return 0
        fi
    fi

    # Create database
    print_info "Creating database '$DB_NAME'..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "CREATE DATABASE $DB_NAME;"
    print_success "Database '$DB_NAME' created successfully"
}

# ============================================================================
# Run Migrations
# ============================================================================

run_migrations() {
    print_header "Running Migrations"

    # Check if migrations directory exists
    if [ ! -d "$MIGRATIONS_DIR" ]; then
        print_error "Migrations directory not found: $MIGRATIONS_DIR"
        exit 1
    fi

    # Find all migration files (excluding rollback files)
    MIGRATION_FILES=$(find "$MIGRATIONS_DIR" -name "*.sql" ! -name "*rollback*" | sort)

    if [ -z "$MIGRATION_FILES" ]; then
        print_warning "No migration files found"
        return 0
    fi

    # Run each migration
    for migration in $MIGRATION_FILES; do
        migration_name=$(basename "$migration")
        print_info "Running migration: $migration_name"

        if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$migration" > /dev/null; then
            print_success "Migration $migration_name completed"
        else
            print_error "Migration $migration_name failed"
            exit 1
        fi
    done
}

# ============================================================================
# Verify Setup
# ============================================================================

verify_setup() {
    print_header "Verifying Setup"

    # Check tables
    print_info "Checking tables..."
    TABLES=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
    print_success "Found $TABLES tables"

    # List tables
    print_info "Tables in database:"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\dt"

    # Count records
    print_info "Record counts:"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
        SELECT 'users' AS table_name, COUNT(*) AS count FROM users
        UNION ALL
        SELECT 'landing_pages', COUNT(*) FROM landing_pages
        UNION ALL
        SELECT 'leads', COUNT(*) FROM leads;
    "
}

# ============================================================================
# Rollback
# ============================================================================

rollback() {
    print_header "Rolling Back Migrations"

    print_warning "This will delete all data in the database!"
    read -p "Are you sure you want to continue? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        print_info "Rollback cancelled"
        return 0
    fi

    # Find all rollback files
    ROLLBACK_FILES=$(find "$MIGRATIONS_DIR" -name "*rollback*.sql" | sort -r)

    if [ -z "$ROLLBACK_FILES" ]; then
        print_warning "No rollback files found"
        return 0
    fi

    # Run each rollback
    for rollback_file in $ROLLBACK_FILES; do
        rollback_name=$(basename "$rollback_file")
        print_info "Running rollback: $rollback_name"

        if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$rollback_file" > /dev/null; then
            print_success "Rollback $rollback_name completed"
        else
            print_error "Rollback $rollback_name failed"
            exit 1
        fi
    done
}

# ============================================================================
# Main Menu
# ============================================================================

show_menu() {
    echo -e "\n${BLUE}DMAT Database Setup${NC}"
    echo "===================="
    echo "1) Full setup (create DB + run migrations)"
    echo "2) Create database only"
    echo "3) Run migrations only"
    echo "4) Verify setup"
    echo "5) Rollback migrations"
    echo "6) Exit"
    echo ""
}

# ============================================================================
# Main Script
# ============================================================================

main() {
    print_header "DMAT Database Setup Script"

    echo "Configuration:"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"

    # If script is run with argument, execute directly
    if [ $# -gt 0 ]; then
        case "$1" in
            setup)
                check_prerequisites
                create_database
                run_migrations
                verify_setup
                print_success "Setup completed successfully!"
                ;;
            rollback)
                check_prerequisites
                rollback
                print_success "Rollback completed!"
                ;;
            verify)
                check_prerequisites
                verify_setup
                ;;
            *)
                print_error "Unknown command: $1"
                echo "Usage: $0 [setup|rollback|verify]"
                exit 1
                ;;
        esac
        exit 0
    fi

    # Interactive menu
    while true; do
        show_menu
        read -p "Select an option (1-6): " choice
        case $choice in
            1)
                check_prerequisites
                create_database
                run_migrations
                verify_setup
                print_success "Setup completed successfully!"
                ;;
            2)
                check_prerequisites
                create_database
                ;;
            3)
                check_prerequisites
                run_migrations
                ;;
            4)
                check_prerequisites
                verify_setup
                ;;
            5)
                check_prerequisites
                rollback
                ;;
            6)
                print_info "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please select 1-6."
                ;;
        esac
    done
}

# Run main script
main "$@"
