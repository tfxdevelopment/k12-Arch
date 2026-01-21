.PHONY: help build test run stop clean infra dapr aspire

# Default target
help:
	@echo "K12 Cloud Native - Development Commands"
	@echo ""
	@echo "Infrastructure:"
	@echo "  make infra          - Start infrastructure (SQL, Redis, Azurite)"
	@echo "  make infra-stop     - Stop infrastructure containers"
	@echo "  make infra-clean    - Remove infrastructure containers and volumes"
	@echo ""
	@echo "Development:"
	@echo "  make build          - Build all projects"
	@echo "  make test           - Run all tests"
	@echo "  make aspire         - Run with Aspire AppHost (recommended)"
	@echo "  make dapr           - Run services with Dapr CLI"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean          - Clean build artifacts"
	@echo "  make reset          - Full reset (clean + infra-clean)"

# Infrastructure Management
infra:
	@echo "Starting infrastructure containers..."
	docker-compose up -d sqlserver redis azurite zipkin dapr-placement
	@echo "Infrastructure started. SQL Server: localhost:1433, Redis: localhost:6379"

infra-stop:
	@echo "Stopping infrastructure containers..."
	docker-compose down

infra-clean:
	@echo "Removing infrastructure containers and volumes..."
	docker-compose down -v

# Build
build:
	@echo "Building solution..."
	dotnet restore
	dotnet build --no-restore

# Test
test:
	@echo "Running tests..."
	dotnet test --no-build --verbosity normal

# Run with Aspire (Recommended)
aspire:
	@echo "Starting application with .NET Aspire..."
	dotnet run --project src/K12.AppHost/K12.AppHost.csproj

# Run with Dapr CLI (Alternative)
dapr:
	@echo "Starting services with Dapr CLI..."
	@echo "Enrollment API..."
	dapr run --app-id enrollment-api \
	         --app-port 5001 \
	         --dapr-http-port 3501 \
	         --dapr-grpc-port 50001 \
	         --config ./dapr/config.yaml \
	         --components-path ./dapr/components \
	         -- dotnet run --project src/Api/K12.Api.Enrollment &

# Clean
clean:
	@echo "Cleaning build artifacts..."
	dotnet clean
	find . -type d -name "bin" -o -name "obj" | xargs rm -rf

# Full Reset
reset: clean infra-clean
	@echo "Full reset complete"
