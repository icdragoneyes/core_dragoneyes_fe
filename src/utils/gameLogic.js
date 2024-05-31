export const getRandomInt = (max) => Math.floor(Math.random() * max);

export const determineOutcome = (selected, cpuSelected) => {
  if (selected === cpuSelected) return "Draw!!";
  if ((selected === "Rock" && cpuSelected === "Scissors") || (selected === "Paper" && cpuSelected === "Rock") || (selected === "Scissors" && cpuSelected === "Paper")) {
    return "You Win!";
  }
  return "LOSER!🤪";
};
