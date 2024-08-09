export const getRandomInt = (max) => Math.floor(Math.random() * max);

export const determineOutcome = (selected, cpuSelected) => {
  if (selected === cpuSelected) return "Draw!";
  if ((selected === "rock" && cpuSelected === "scissors") || (selected === "paper" && cpuSelected === "rock") || (selected === "scissors" && cpuSelected === "paper")) {
    return "You Win!";
  }
  return "You Lose!";
};
