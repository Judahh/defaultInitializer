import { SubjectObserver } from 'journaly';

export default interface DefaultInitializer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  journaly:
    | SubjectObserver<any>
    | SubjectObserver<unknown>
    | SubjectObserver<never>
    | undefined;
}
