# Dragon Eyes

Dragon Eyes is a React-based single-page application that allows users to connect their wallets and interact with the ICP blockchain. The application provides features such as user authentication, fetching user data, and displaying game data.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Learn More](#learn-more)

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/rakafantino/icp-web3auth-template.git
   cd icp-web3auth-template
   ```

2. **Install the necessary dependencies:**

   ```sh
   npm install
   ```

3. **Run the app in development mode:**

   ```sh
   npm start
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

4. **Build the app for production:**
   ```sh
   npm run build
   ```
   The built files will be placed in the `build` folder.

## Project Structure

The project's overall structure is composed of a few main directories and files:

- `public/`: Contains static assets that will be served directly by the server.

  - `favicon.ico`: A small icon that represents the website.
  - `index.html`: The main HTML file of the website.
  - `manifest.json`: Metadata for the website's web app manifest.
  - `robots.txt`: Instructions for web robots.

- `src/`: Contains the main application files.

  - `components/`: React components used in the application.
  - `hooks/`: Custom React hooks.
  - `service/`: Service files for interacting with the ICP blockchain.
  - `store/`: State management using Jotai.
  - `App.css`: Main CSS file for the application.
  - `App.js`: Main React component.
  - `index.css`: Additional CSS for the application.
  - `index.js`: Main entry point for the React application.
  - `reportWebVitals.js`: Used for tracking web vitals.

- `README.md`: Project documentation.
- `package.json`: Project metadata and dependencies.
- `package-lock.json`: Lockfile for exact versions of dependencies.

## Available Scripts

In the project directory, you can run:

- `npm start`: Starts the development server and begins watching for changes to the code.
- `npm run build`: Bundles the app into static files for production.
- `npm test`: Runs the tests for the application.
- `npm run eject`: Allows you to customize the configuration of the app.

## Dependencies

The main dependencies for this project are:

- `react`: A JavaScript library for building user interfaces.
- `react-dom`: A package that allows React to interact with the DOM.
- `react-scripts`: A set of scripts that help to create a new React app.
- `jotai`: A state management library for React.
- `@toruslabs/openlogin`: A package for handling user authentication with OpenLogin.

## Configuration

- **Browserslist**: Specifies the target browsers for the project to ensure compatibility.
- **EslintConfig**: Extends the default settings for ESLint, including settings for React and Jest.

## Learn More

To learn more about Create React App and React, check out the following resources:

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs)
- [React Documentation](https://reactjs.org/)

For more advanced configuration and deployment, refer to the Create React App documentation.

```

```
