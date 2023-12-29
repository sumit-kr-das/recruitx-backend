## Development

### Setup

1. Clone the repo into a public GitHub repository (or fork https://github.com/sumit-kr-das/recruitx-backend).

    ```sh
    git clone https://github.com/sumit-kr-das/recruitx-backend
    ```

2. Go to the project folder

    ```sh
    cd recruitx-backend
    ```

3. Install packages with yarn

    ```sh
    yarn install
    ```

4. Set up your `.env` file

    - Duplicate `.env.example` to `.env`
    - Use `openssl rand -base64 32` to generate a key and add it under `JWT_SECRET` in the `.env` file.

5. Start your redis server

6. Run this project

    ```sh
    yarn dev
    ```

#### Quick start with `docker`

1. Run the docker-compose.yml file

    ```sh
    docker compose up
    ```
