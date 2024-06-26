export const getRandomInt = (max) => Math.floor(Math.random() * max);

export const determineOutcome = (selected, cpuSelected) => {
  if (selected === cpuSelected) return "Draw!";
  if ((selected === "Rock" && cpuSelected === "Scissor") || (selected === "Paper" && cpuSelected === "Rock") || (selected === "Scissor" && cpuSelected === "Paper")) {
    return "You Win!";
  }
  return "You Lose!";
};
