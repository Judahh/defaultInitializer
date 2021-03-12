// file deepcode ignore no-any: any needed
import { settings } from 'ts-mixer';
import DefaultInitializer from './defaultInitializer';
import { SenderReceiver } from 'journaly';
settings.initFunction = 'init';
/* eslint-disable @typescript-eslint/no-explicit-any */
export default class Default {
  protected journaly:
    | SenderReceiver<any>
    | SenderReceiver<unknown>
    | SenderReceiver<never>
    | undefined;
  private className!: string;
  private name!: string;
  private type!: string;

  constructor(initDefault?: DefaultInitializer) {
    this.init(initDefault);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected initJournaly() {
    this.addAllMethods();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setJournaly(
    journaly:
      | SenderReceiver<any>
      | SenderReceiver<unknown>
      | SenderReceiver<never>
  ) {
    this.journaly = journaly;
    this.initJournaly();
  }

  setName(name: string): void {
    this.name = name;
  }

  setClassName(className: string): void {
    this.className = className;
  }

  setType(type: string): void {
    this.type = type;
  }

  getName(): string {
    return this.name;
  }

  getClassName(): string {
    return this.className;
  }

  getType(): string {
    return this.type;
  }

  private getConstructorName(object) {
    let name = object.constructor.name;
    if (name.includes('_')) name = name.split('_')[1];
    return name;
  }

  protected generateClassName(): void {
    this.setClassName(this.getConstructorName(this));
  }

  protected generateName(): void {
    this.setName(this.getClassName());
  }

  protected generateType(): void {
    this.setType('');
  }

  protected init(initDefault?: DefaultInitializer): void {
    this.generateType();
    this.generateClassName();
    this.generateName();
    if (initDefault && initDefault.journaly)
      this.setJournaly(initDefault.journaly);
  }

  private addAllMethods() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let obj = this;
    if (this.journaly && this.className)
      do {
        //! maybe a sort and filter is needed to remove same method.
        for (const method of Object.getOwnPropertyNames(obj)) {
          if (
            typeof this[method] === 'function' &&
            method !== 'constructor' //&& //not the constructor
            // (index == 0 || property !== array[index - 1]) //&& //not overriding in this prototype
            // props.indexOf(property) === -1 //not overridden in a child
          ) {
            const fullName = this.className + '.' + method;
            // console.log(fullName);
            if (
              !this.journaly.getTopics() ||
              !this.journaly.getTopics().includes(fullName)
            ) {
              const boundedMethod = this[method].bind(this);
              this.journaly.subscribe(boundedMethod, fullName);
            }
          }
        }
      } while ((obj = Object.getPrototypeOf(obj)));
  }
}
