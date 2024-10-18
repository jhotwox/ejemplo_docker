# **Ejemplo docker**
Vamos a crear dos servicios en docker que simulen un microservicio en donde el primer servico le pida al segundo servicio de usuarios los usuarios registrados

# **Proceso**
Crear una carpeta en donde contendremos el servicio de bienvenida y otra carpeta para contener el servicio de usuario

En estas carpetas vamos a crear un archivo package.json con el comando:
```BASH
npm init -y
```

### **user-service**
>`app.listen()` Inicializar un servidor de express en el puerto 3001
> 
>`app.get("/users")` Maneja las peticiones HTTP GET y nos devuelve el archivo json de los usuarios
```JS
const express = require("express")
const app = express()

const users = [
    {id: 1, name: "Pepe"},
    {id: 2, name: "Juan"},
    {id: 3, name: "Luis"}
]

app.get("/users", (req, res) => {
    res.json(users)
})

app.listen(3001, () => {
    console.log("User service is running on port 3001")
})
```

### **welcome-service**
>`app.get("/users")` realiza una petición asincrona a user-service para obtener los usuarios y una vez que los obtiene los devuelve en formato json
>
>La petición get se realiza `user-service` ya que al tratarse de contenedores estos crean su propia red por lo que al crear estos contenedores con un `docker compose` estan dentro de la misma red así que pueden conectarse entre si a través del nombre del servicio
```JS
const express = require("express")
const axios = require("axios")
const app = express()

app.get("/", (req, res) => {
  res.send("Welcome to my awesome app v2!")
})

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})

app.get("/users", async (req, res) => {
    try {
        const response = await axios.get("http://user-service:3001/users")
        res.json(response.data)
    } catch (err) {
        console.log("[-] Err -> ", err)
        res.status(500).send("Error obtaining users")
    }
})
```

### **docker file**
Crearemos un archivo docker para cada servicio el cual sirve para configurar nuestro contenedor

>`FROM node:19-alpine` Se trata de la imagen base para el contenedor, en este caso se trata de una versión de node.js basada en Alpine linux

>`COPY package*.json ./` y `COPY . .` sirven para copiar el contenido del directorio, es decir todos los archivos necesarios para montar el servicio usando node.js con express

>`WORKDIR /app` Establece el directorio de trabajo

>`RUN npm install` Instala los paquetes necesarios establecidos en el package.json. Por ejemplo: express y axios

>`EXPOSE` Exponer el puerto indicado

>`CMD [ "node","index.js"]` Se encarga de iniciar el servidor Node.js al inciar el contenedor

> ### welcome-service/Dockerfile
>```Dockerfile
>FROM node:19-alpine
>
>
>COPY package*.json ./
>COPY . .
>
>WORKDIR /app
>
>RUN npm install
>
>EXPOSE 3000
>
>CMD [ "node","index.js"]
>```

> ### user-service/Dockerfile
>```Dockerfile
>FROM node:19-alpine
>
>
>COPY package*.json ./
>COPY . .
>
>WORKDIR /app
>
>RUN npm install
>
>EXPOSE 3001
>
>CMD [ "node","index.js"]
>```

### **docker compose**
>En el directorio raiz del proyecto crearemos un archivo `docker compose` que se encargara de ejecutar los contenedores que asignemos

>`services:` Define los contenedores que se van a ejecutar

>`welcome-service:` y `user-service:` son los servicios a ejecutar

>`build:` Indica el directorio en el que se encuentra el dockerfile del contenedor

>`ports:` Mapea el puerto del contenedor al puerto de nuestra maquina 

```YML
version: '3'
services:
  welcome-service:
    build: ./welcome-service
    ports:
      - "3000:3000"

  user-service:
    build: ./user-service
    ports:
      - "3001:3001"
```

### **Iniciar el proyecto**
>Para contruir las imagenes de los contenedores solo tenemos que ejecutar el siguiente comando en el directorio raiz que es donde se encuentra el archivo `docker compose`

```BASH
docker-compose up --build
```

# Resultados
>Dirigirnos el servicio de usuarios
><img src="">

>Dirigirnos al servicio de bienvenida
><img src="">

>Dirigirnos al servicio de bienvenida en la dirección /users
><img src="">