import { randomIntFromInterval } from "./commonFunctions";

const randomProperties = (arrayWithRandomProperties) => {
  const index = randomIntFromInterval(0, arrayWithRandomProperties.length - 1);
  return arrayWithRandomProperties[index];
};
export default randomProperties;
