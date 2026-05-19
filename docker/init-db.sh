#!/bin/bash
set -e

psql -U "$POSTGRES_USER" -c "CREATE DATABASE evm_bot_test;" || true
