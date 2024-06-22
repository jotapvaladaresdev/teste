# Teste de Aplicação Node.js com TypeScript, Express, MongoDB, Redis e Nginx

Esta é uma aplicação de exemplo construída com Node.js, TypeScript e Express, utilizando MongoDB para armazenamento de dados, Redis para caching e Nginx como servidor web. A aplicação permite o registro de clientes e inclui testes unitários.

## Pré-requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Instalação

1. Clone o repositório:
    git clone https://github.com/seu-usuario/teste-aplicacao.git
    cd teste-aplicacao

## Executando a Aplicação com Docker

1. Inicie os containers Docker:
    docker-compose up

2. A aplicação estará disponível em `http://localhost:8080`.

### Nota sobre Variáveis de Ambiente

As variáveis de ambiente necessárias para a aplicação (`MONGO_URI`, `REDIS_HOST`, `REDIS_PORT`) são definidas diretamente no arquivo `docker-compose.yml`. Portanto, não é necessário criar um arquivo `.env` separadamente. Se você preferir utilizar um arquivo `.env`, pode adicioná-lo e as variáveis serão lidas a partir dele também.

## Endpoints da API

### Registrar Cliente

**POST /clients**

**Request Body:**
```json
{
  "name": "João",
  "email": "joao@example.com",
  "phone": "1199887766",
  "cep": "01001000"
}
```

**Resposta de Sucesso:**
```json
{
  "id": "some-unique-id",
  "name": "João",
  "email": "joao@example.com",
  "phone": "1199887766",
  "cep": "01001000",
  "address": {
    "cep": "01001000",
    "street": "Praça da Sé",
    "neighborhood": "Sé",
    "city": "São Paulo",
    "state": "SP"
  }
}
```

### Listar Clientes

**GET /clients?page=1&limit=10**

**Resposta de Sucesso:**
```json
[
  {
    "id": "some-unique-id",
    "name": "João",
    "email": "joao@example.com",
    "phone": "1199887766",
    "cep": "01001000",
    "address": {
      "cep": "01001000",
      "street": "Praça da Sé",
      "neighborhood": "Sé",
      "city": "São Paulo",
      "state": "SP"
    }
  }
]
```

### Obter Cliente por ID

**GET /clients/:id**

**Resposta de Sucesso:**
```json
{
  "id": "some-unique-id",
  "name": "João",
  "email": "joao@example.com",
  "phone": "1199887766",
  "cep": "01001000",
  "address": {
    "cep": "01001000",
    "street": "Praça da Sé",
    "neighborhood": "Sé",
    "city": "São Paulo",
    "state": "SP"
  }
}
```

### Deletar Cliente por ID

**DELETE /clients/:id**

**Resposta de Sucesso:**
```json
{
  "message": "Client deleted successfully"
}
```

### Buscar Clientes por Nome

**GET /clients/search?name=João&page=1&limit=10**

**Resposta de Sucesso:**
```json
[
  {
    "id": "some-unique-id",
    "name": "João",
    "email": "joao@example.com",
    "phone": "1199887766",
    "cep": "01001000",
    "address": {
      "cep": "01001000",
      "street": "Praça da Sé",
      "neighborhood": "Sé",
      "city": "São Paulo",
      "state": "SP"
    }
  }
]
```

## Testes

Para executar os testes unitários, use o comando:

```bash
npm test
```

## Estrutura do Projeto

A estrutura do projeto segue os princípios de Clean Architecture, separando as responsabilidades em diferentes camadas. Aqui está uma visão geral da estrutura dos diretórios e dos principais arquivos:

### `src/`

Este é o diretório principal que contém todo o código fonte da aplicação.

- #### `application/`
  Contém a lógica de aplicação, incluindo serviços que orquestram a lógica de negócios e interagem com os repositórios.

  - **services/**
    - `ClientService.ts` - Contém a lógica para gerenciar clientes, incluindo operações como registro, listagem e exclusão.

- #### `domain/`
  Contém as entidades do domínio e interfaces dos repositórios.

  - **entities/**
    - `Client.ts` - Define a entidade Cliente com seus atributos.
    
  - **repositories/**
    - `ClientRepository.ts` - Interface para operações de persistência relacionadas aos clientes.
    - `AddressRepository.ts` - Interface para operações de persistência relacionadas aos endereços.

- #### `infrastructure/`
  Contém as implementações específicas de infraestrutura, como configurações de banco de dados e cache.

  - **cache/**
    - `redisClient.ts` - Configuração do cliente Redis para caching.

  - **database/**
    - `mongoose.ts` - Configuração da conexão com o MongoDB usando Mongoose.

  - **web/**
    - `server.ts` - Configuração do servidor Express.

- #### `interfaces/`
  Contém os controladores que lidam com as requisições HTTP e interagem com os serviços da aplicação.

  - **controllers/**
    - `ClientController.ts` - Controlador responsável pelos endpoints relacionados a clientes.

- #### `test/`
  Contém os testes unitários para a aplicação.

  - `clientService.test.ts` - Testes para o serviço de clientes.

### Configuração do Docker

- **docker-compose.yml**
  - Define os serviços Docker para a aplicação, incluindo o servidor Node.js, MongoDB, Redis e Nginx.

- **Dockerfile**
  - Define a configuração da imagem Docker para a aplicação Node.js.

- **nginx.conf**
  - Configuração do Nginx para servir a aplicação na porta 8080.

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commite suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faça o push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## Contato

Seu Nome - [seu-email@example.com](mailto:seu-email@example.com)

Link do Projeto: [https://github.com/seu-usuario/teste-aplicacao](https://github.com/seu-usuario/teste-aplicacao)
```

Certifique-se de ajustar os campos como o URL do repositório, seu nome, e-mail, e outras informações específicas do seu projeto antes de subir para o GitHub.