// file deepcode ignore no-any: any needed
import { SenderReceiver } from 'journaly';

export default interface IDefault {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  journaly: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | SenderReceiver<any>
    | SenderReceiver<unknown>
    | SenderReceiver<never>
    | undefined;
}
