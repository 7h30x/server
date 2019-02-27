# Basic image dari image yang ingin kita buat
FROM ubuntu:16.04

# Command yang kita lakukan ketika membuat image tersebut
RUN apt-get update  \ 
  && apt-get install -y curl sudo git zip unzip vim nano nginx \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
  && curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash - \
  && apt-get install -y nodejs \
  && echo "daemon off;" >> /etc/nginx/nginx.conf 

# Command yang kita lakukan pada Docker file ini akan dijalankan
# pada folder yang kita tentukan disini
# Contoh ketika kita melakukan npm run start
# Kita akan menjalankannya di folder /user/local/application
WORKDIR /usr/local/application

# Melakukan setting PORT environment kita
# Dengan ini aplikasi express kita akan jalan
# pada port 80
ENV PORT=80

# Command yang akan dijalankan ketika image ini berhasil dijalankan
# pada sebuah container
CMD [ "npm", "run", "start"]