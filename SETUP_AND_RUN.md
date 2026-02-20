# How to Run the Map Eg Recruitment Project

Follow these steps to set up and run the project locally.

## Prerequisites

1.  **Node.js**: Ensure you have Node.js installed.
2.  **PostgreSQL**: Ensure you have PostgreSQL installed and running.

## Setup Steps

1.  **Install Dependencies**
    Open your terminal in the project directory and run:
    ```bash
    npm install
    ```

2.  **Configure Environment**
    Check your `.env` file. It should look like this (adjust password if needed):
    ```env
    DATABASE_URL="postgresql://postgres:password@localhost:5432/mapeg"
    NEXT_PUBLIC_APP_URL="http://localhost:3000"
    ```
    *Note: Make sure your local PostgreSQL has a user `postgres` with password `password`, or update the URL to match your credentials.*

3.  **Setup Database**
    Push the schema to your database:
    ```bash
    npm run db:push
    ```

4.  **Start the Server**
    Run the development server:
    ```bash
    npm run dev
    ```

5.  **Access the Website**
    Open your browser and visit:
    [http://localhost:3000](http://localhost:3000)
