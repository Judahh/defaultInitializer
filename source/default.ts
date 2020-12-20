// file deepcode ignore no-any: any needed
import { settings } from 'ts-mixer';
import DefaultInitializer from './defaultInitializer';
import { SubjectObserver } from 'journaly';
settings.initFunction = 'init';
/* eslint-disable @typescript-eslint/no-explicit-any */
export default class Default {
  protected journaly:
    | SubjectObserver<any>
    | SubjectObserver<unknown>
    | SubjectObserver<never>
    | undefined;
  private className!: string;
  private name!: string;
  private type!: string;

  constructor(initDefault?: DefaultInitializer) {
    this.init(initDefault);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected initJournaly() {
    if (this.className) {
      const methods = this.getAllMethods();
      // console.log(this.element);
      // console.log(methods);

      for (const method of methods) {
        const fullName = this.className + '.' + method;
        // console.log(fullName);
        if (
          this.journaly &&
          (!this.journaly.getTopics() ||
            !this.journaly.getTopics().includes(fullName))
        ) {
          const boundedMethod = this[method].bind(this);
          this.journaly.subscribe(fullName, boundedMethod);
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setJournaly(
    journaly:
      | SubjectObserver<any>
      | SubjectObserver<unknown>
      | SubjectObserver<never>
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

  private getAllMethods(): Array<any> {
    let props = [];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let obj = this;
    do {
      const newProps = Object.getOwnPropertyNames(obj);
      props = props.concat(newProps as Array<never>);
    } while ((obj = Object.getPrototypeOf(obj)));

    return props.sort().filter((property, index, array) => {
      if (
        property != array[index + 1] &&
        typeof this[property] == 'function' &&
        property !== 'constructor' //&& //not the constructor
        // (index == 0 || property !== array[index - 1]) //&& //not overriding in this prototype
        // props.indexOf(property) === -1 //not overridden in a child
      ) {
        return true;
      }
    });
  }
}
