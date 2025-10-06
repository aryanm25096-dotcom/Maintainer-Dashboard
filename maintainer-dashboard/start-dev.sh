#!/bin/bash
echo "Setting NODE_OPTIONS for memory optimization..."
export NODE_OPTIONS=--max-old-space-size=4096
echo "Starting maintainer dashboard..."
npm run dev