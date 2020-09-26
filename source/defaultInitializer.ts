import { Journaly } from 'journaly';

export default interface DefaultInitializer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  journaly: Journaly<any> | Journaly<unknown> | Journaly<never>;
}
