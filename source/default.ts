// file deepcode ignore no-any: any needed
import IDefault from './iDefault';
import { SenderReceiver } from 'journaly';
import Methods from './methods';
export default abstract class Default {
  protected journaly: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | SenderReceiver<any>
    | SenderReceiver<unknown>
    | SenderReceiver<never>
    | undefined;
  protected className!: string;
  protected name!: string;
  protected type = '';
  protected cRUDMethods = ['create', 'read', 'update', 'delete', 'other'];
  protected baseMethods = [
    ...this.cRUDMethods,
    'createItem',
    'createSingle',
    'createArray',
    'readByFilter',
    'readItemById',
    'readItem',
    'readArray',
    'updateByFilter',
    'updateItem',
    'updateArray',
    'deleteByFilter',
    'deleteItem',
    'deleteItemById',
    'deleteArray',
    'other',
  ];
  protected commonMethods = [
    ...this.baseMethods,
    'options',
    'authentication',
    'permission',
    'key',
    'sign',
    'sendVerification',
    'removePermissionsAndInstances',
    'getPersonAndIdentifications',
    'resetPermissionsAndInstances',
  ];

  constructor(initDefault?: IDefault) {
    this.init(initDefault);
  }

  setJournaly(
    journaly:
      | SenderReceiver<any>
      | SenderReceiver<unknown>
      | SenderReceiver<never>
  ) {
    this.journaly = journaly;
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

  protected getConstructorName(object) {
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

  protected init(initDefault?: IDefault): void {
    this.generateType();
    this.generateClassName();
    this.generateName();
    if (initDefault && initDefault.journaly) {
      this.setJournaly(initDefault.journaly);
      this.addMethods(initDefault?.methods);
    }
  }

  protected addMethods(methods?: Methods | string[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    //! check email, auth (signUpService, dbHandler), sequelizePersistence
    // add just create, read, update, delete, other, options,
    // authentication, permission, key, sign, sendVerification,
    // removePermissionsAndInstances, getPersonAndIdentifications,
    let obj = this;
    if (this.journaly && this.className)
      if (methods === Methods.all) {
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
      } else {
        methods =
          methods === undefined || methods === null ? Methods.common : methods;
        switch (methods) {
          case Methods.cRUD:
            methods = this.cRUDMethods;
            break;

          case Methods.base:
            methods = this.baseMethods;
            break;

          case Methods.common:
            methods = this.commonMethods;
            break;

          case Methods.none:
            return;

          default:
            break;
        }
        for (const method of methods) {
          const fullName = this.className + '.' + method;
          // console.log(fullName);
          if (
            (!this.journaly.getTopics() ||
              !this.journaly.getTopics().includes(fullName)) &&
            this[method]
          ) {
            const boundedMethod = this[method]?.bind(this);
            this.journaly.subscribe(boundedMethod, fullName);
          }
        }
      }
  }
}
