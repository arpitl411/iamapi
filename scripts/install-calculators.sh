#!/bin/bash

# Installation script for Dynamic Calculators Feature

echo "Installing required dependencies for Dynamic Calculators..."

# Install @nestjs/axios and axios if not already installed
npm install --save @nestjs/axios axios

echo "✓ Dependencies installed successfully"
echo ""
echo "Next steps:"
echo "1. Add DynamicCalculatorsModule to your AppModule imports"
echo "2. Run database migrations or sync entities"
echo "3. Start your application"
echo ""
echo "For detailed instructions, see src/calculators/README.md"
