## Como Usar

Para rodar essa aplicação você precisa ter [Git](https://git-scm.com) e [Node.js](https://nodejs.org/en/download/) instalados no seu computador. Após instalar, siga os comandos no terminal.

```bash
# Clona o repositório
$ git clone https://github.com/lidiagaldino/cyco-backend

# Entre no repositório
$ cd cyco-backend/register

# Instala dependencias
$ npm install

# Sobe o banco de dados teste
$ docker compose up

# Abrir VSCode
$ code .
```

Crie um arquivo .env dessa forma

```.env
DATABASE_URL="mysql://root:root@localhost:1000/cyco"
SECRET=hashstring
SALT=8
EXPIRES_IN=7d
```

Rode esses comandos

```bash
# Migrar o schema do banco de dados
$ npx prisma migrate dev

# Rodar o seed para popular o banco de dados
$ npx prisma db seed

# Rodar a aplicação em modo dev ns porta 3000
$ npm run start:dev
```

## Endpoints

## Índice
- [POST /deliveryman](#post-deliveryman)
- [GET /deliveryman/:id](#get-deliverymanid)
- [POST /waste-collectors](#post-waste-collector)
- [GET /waste-collectors](#get-waste-collector)
- [POST /generator](#post-generator)
- [GET /generator/:id](#get-generatorid)
- [POST /session](#session)
---

# POST /deliveryman

```bash
POST http://localhost:3000/deliveryman
```
#### Descrição
Este endpoint cria um novo entregador com as informações fornecidas.

#### Headers
```json
{
  "Content-Type": "application/json"
}
```


#### Body
```json
{
  "email": "deliveryman@gmail.com",
  "password": "12345678",
  "name": "Delivery Man",
  "phone": {
    "ddd": 11,
    "ddi": 55,
    "number": 961869670
  },
  "birthDate": "2015-03-25T00:00:00.000Z",
  "licenseNumber": "20934683414",
  "vehicle": {
    "id": "3d4e440e-91a8-41c7-9479-391c2bc52e03",
    "colorId": "be0ec369-4271-4ec8-be6a-a9d6d40c422c",
    "modelId": "26720417-b635-44ba-bf7d-1791950a8afe",
    "plate": "ECJ8744"
  }
}
```

#### Resposta
- 201 Created: Entregador criado com sucesso.
- 400 Bad Request: Entrada inválida ou campos obrigatórios ausentes.
- 409 Conflict: Telefone ou email já existem

# GET /deliveryman/:id
```bash
GET http://localhost:3000/deliveryman/:id
```

#### Descrição
Este endpoint recupera os detalhes de um entregador pelo seu ID único.

#### Parâmetros
:id (Parâmetro de Caminho): O UUID do entregador a ser recuperado.

#### Exemplo
```bash
GET http://localhost:3000/deliveryman/3425cdf3-194e-4f00-86a2-17db910a732e
```

#### Resposta
- 200 OK: Retorna os detalhes do entregador.
- 404 Not Found: Entregador com o ID especificado não existe.

# POST /waste-collectors

```bash
POST http://localhost:3000/waste-collectors
```
#### Descrição
Este endpoint cria um novo catador com as informações fornecidas.

#### Headers
```json
{
  "Content-Type": "application/json"
}
```


#### Body
```json
{
  "email": "collector@gmail.com",
  "password": "12345678",
  "name": "Catador",
  "isEnterprise": false,
  "materials": [
    "Glass"
  ],
   "phone": {
    "ddd": 11,
    "ddi": 55,
    "number": 961868671
  },
  "document": "16543092068",
  "address": {
    "zipCode": "06449300"
  }
}
```

#### Resposta
- 201 Created: Catador criado com sucesso.
- 400 Bad Request: Entrada inválida ou campos obrigatórios ausentes.
- 409 Conflict: Telefone, email ou documento já existem

# GET /waste-collectors
```bash
GET http://localhost:3000/waste-collectors
```

#### Descrição
Este endpoint recupera os detalhes de todos catadores cadastrados.

#### Resposta
- 200 OK: Retorna os detalhes dos catadores.

# POST /generator

```bash
POST http://localhost:3000/generator
```
#### Descrição
Este endpoint cria um novo gerador com as informações fornecidas.

#### Headers
```json
{
  "Content-Type": "application/json"
}
```


#### Body
```json
{
  "email": "lidia1@gmail.com",
  "password": "lidia123456",
  "birthDate": "2015-03-25T00:00:00.000Z",
  "document": "47189168877",
  "name": "Lídia Galdino 4",
  "phone": {
    "ddd": 11,
    "ddi": 55,
    "number": 961869684
  }
}
```

#### Resposta
- 201 Created: Gerado criado com sucesso.
- 400 Bad Request: Entrada inválida ou campos obrigatórios ausentes.
- 409 Conflict: Telefone ou email já existem

# GET /generator/:id
```bash
GET http://localhost:3000/generator/:id
```

#### Descrição
Este endpoint recupera os detalhes de um gerador pelo seu ID único.

#### Parâmetros
:id (Parâmetro de Caminho): O UUID do gerador a ser recuperado.

#### Exemplo
```bash
GET http://localhost:3000/generator/3425cdf3-194e-4f00-86a2-17db910a732e
```

#### Resposta
- 200 OK: Retorna os detalhes do gerador.
- 404 Not Found: Gerador com o ID especificado não existe.

# POST /session

```bash
POST http://localhost:3000/session
```
#### Descrição
Este endpoint retorna um token de autenticação de usuário e informações do mesmo.

#### Headers
```json
{
  "Content-Type": "application/json"
}
```


#### Body
```json
{
  "email": "lidia1@gmail.com",
  "password": "lidia123456",
}
```

#### Resposta
- 200 OK: Token gerado com sucesso.
- 400 Bad Request: Entrada inválida ou campos obrigatórios ausentes.
- 401 Unauthorized: Não autorizado.

#### Body de resposta caso OK
```json
{
  "user": {
    "name": "Lídia Galdino",
    "email": "lidia1@gmail.com"
  },
  "token": "tokenjwt",
}
```
