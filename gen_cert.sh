#!/usr/bin/env bash

if [ -z "$1" ]; then
	echo "usage: $0 <expiry time, years>"
	exit 1
fi

if [ ! -e certs/root.key ]; then
	echo "root key doesn't exist - run gen_root.sh first"
	exit 1
fi

echo "[$0] Generating key"
openssl genrsa -out certs/cert.key 2048
echo "[$0] Generating CSR"
openssl req -new -key certs/cert.key -out certs/cert.csr
echo "[$0] Generating certificate from CSR"
if [ ! -f certs/root.srl ]; then
	openssl x509 -req -in certs/cert.csr -CA certs/root.pem -CAkey certs/root.key -CAcreateserial -out certs/cert.pem -days "$(( $1 * 365 ))"
else
	openssl x509 -req -in certs/cert.csr -CA certs/root.pem -CAkey certs/root.key -CAserial certs/root.srl -out certs/cert.pem -days "$(( $1 * 365 ))"	
fi
rm certs/cert.csr
echo "[$0] Done"
