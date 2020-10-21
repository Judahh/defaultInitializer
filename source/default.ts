import { settings } from 'ts-mixer';
import DefaultInitializer from './defaultInitializer';
import { Journaly } from 'journaly';
settings.initFunction = 'init';
/* eslint-disable @typescript-eslint/no-explicit-any */
export default class Default {
  protected element: string | undefined;

  protected journaly:
    | Journaly<any>
    | Journaly<unknown>
    | Journaly<never>
    | undefined;

  protected baseClass = 'Default';

  public constructor(initDefault: DefaultInitializer) {
    this.init(initDefault);
  }
  protected init(initDefault: DefaultInitializer): void {
    this.journaly = initDefault.journaly;

    if (!this.element || !this.constructor.name.includes(this.baseClass)) {
      this.element = this.constructor.name;
    }

    if (!this.element.includes(this.baseClass)) {
      const methods = this.getAllMethods();
      // console.log(this.element);
      // console.log(methods);

      for (const method of methods) {
        const fullName = this.element + '.' + method;
        // console.log(fullName);
        if (
          this.journaly &&
          (!this.journaly.getSubjects() ||
            !this.journaly.getSubjects().includes(fullName))
        ) {
          const boundedMethod = this[method].bind(this);
          this.journaly.subscribe(fullName, boundedMethod);
        }
      }
    }
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
