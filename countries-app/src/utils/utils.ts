import Country from '../models/interface';

function isCountryValid(c: Country):boolean {
  // population 0
  if (c.population === 0 || !c.population) {
    return false;
  }
  return c.borders?.length !== undefined;
}

export default { isCountryValid };
