// file deepcode ignore no-any: any needed
import { SenderReceiver } from 'journaly';
import Methods from './methods';

export default interface IDefault {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  journaly: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | SenderReceiver<any>
    | SenderReceiver<unknown>
    | SenderReceiver<never>
    | undefined;
  methods?: Methods | string[];
}
