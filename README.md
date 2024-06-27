# VMEDIA Proxy Server

This project is a proxy server built using the NestJS framework. It retrieves content from a given website, modifies the content by adding the "™" symbol to every six-letter word, and ensures that all internal navigation links point to the proxy server itself. The application also maintains the functionality of the original site, including images and other resources.

## Prerequisites

- Node.js (v18.x recommended)
- npm (v8.x recommended)

## Getting Started

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/nestjs-proxy-server.git
    cd nestjs-proxy-server
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

   ```

### Environment Variables

Create a `.env` file in the root directory of your project with the following content:

```dotenv
# .env file
PROXY_URL=https://docs.docker.com # default - https://docs.nestjs.com
PORT=3000
```

Adjust the `PROXY_URL` value as needed for your environment. This variable will be used by the application to fetch content from the specified website.

### Running the Application

#### Development

To run the application in development mode:
```bash
npm run start:dev
```

The server will start on http://localhost:3000.

## Production
To run the application in production mode:

```
npm run build
npm run start:prod
```

### API Endpoints
- Proxy Endpoint: Access the proxy by navigating to http://localhost:3000/proxy/{path}.
- - Example: http://localhost:3000/proxy/websockets/gateways will proxy and modify content from https://docs.nestjs.com/websockets/gateways.

### Running Tests
To run unit and integration tests:
```
npm test
```