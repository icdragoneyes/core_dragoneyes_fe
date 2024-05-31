# Roshambo Game

Welcome to Roshambo, a classic Rock, Paper, Scissors game built with React and Vite. Challenge the computer and see if you can outsmart it!

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Game Logic](#game-logic)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Roshambo is a simple and interactive game where you can play Rock, Paper, Scissors against the computer. The game includes animations, sound effects, and taunts to make the experience more engaging.

## Features

- **Interactive UI**: A user-friendly interface with animations and sound effects.
- **Game Logic**: Randomized computer choices and outcome determination.
- **Alerts**: Informative and fun alerts using SweetAlert2.
- **Responsive Design**: Works well on both desktop and mobile devices.

## Getting Started

To get started with the Roshambo game, follow these steps:

1. **Clone the repository**:

   ```sh
   git clone https://github.com/your-username/roshambo.git
   ```

2. **Navigate to the project directory**:

   ```sh
   cd roshambo
   ```

3. **Install dependencies**:

   ```sh
   npm install
   ```

4. **Start the development server**:
   ```sh
   npm run dev
   ```

## Usage

Once the development server is running, you can open your browser and navigate to `http://localhost:5173` to start playing the game.

- **Start the Game**: Click the "Start Game" button in the welcome alert to begin.
- **Make a Choice**: Click on Rock, Paper, or Scissors to make your move.
- **View Results**: See if you win, lose, or draw against the computer.
- **Play Again**: After each round, you can choose to play again.

## Game Logic

The game logic is simple:

- **Rock** beats Scissors
- **Scissors** beats Paper
- **Paper** beats Rock

The computer's choice is randomized, and the outcome is determined based on the player's choice and the computer's choice.

## Dependencies

The project uses the following main dependencies:

- **React**: For building the user interface.
- **React Router DOM**: For navigation.
- **SweetAlert2**: For displaying alerts.
- **Vite**: For development and build tooling.

## Contributing

Contributions are welcome! If you have any suggestions or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
