import { levelNames, eyesThresholds } from "../constant/level";

export const determineLevelName = (eyesAmount) => {
  const index = eyesThresholds.findIndex((threshold) => eyesAmount < threshold);
  return levelNames[index === -1 ? levelNames.length - 1 : index - 1];
};
