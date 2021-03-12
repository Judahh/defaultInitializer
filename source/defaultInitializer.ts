// file deepcode ignore no-any: any needed
import { SenderReceiver } from 'journaly';

export default interface DefaultInitializer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  journaly:
    | SenderReceiver<any>
    | SenderReceiver<unknown>
    | SenderReceiver<never>
    | undefined;
}
