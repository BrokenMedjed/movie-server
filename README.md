# Social Coding movie night HTTPS server... or something like that #
I wrote this at night... nice syntax reminder I guess
## How to use ##
Make a directory called `certs` in this directory and use `gen_root.sh` and then `gen_cert.sh` to generate the SSL certificates for the server, OR use your own certificates (place them in the certs folder,
and call the CA certificate root.pem, your actual certificate cert.pem and your certificate key cert.key). After that, you can invoke node:
```
node main.js <port> <file> <MIME type>
```
That's it. Lame, I only got like half a level of XP from writing this.
