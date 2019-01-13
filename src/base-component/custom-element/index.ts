import { default as BootstrapElement } from '../bootstrap';
import { toCamelCase } from '../helpers';

/**
 * custom element base class
 * below methods available to make this base element flexible
 *  - define('element-name') this will help register customElement only if it is not already deinfined
 *  - willConnect() this will be triggered before connectedCallback()
 *  - onConnect() this will be triggered on connectedCallback()
 *  - didConnect() this will be triggered only once after didRender()
 *  - willRender() will be triggered before render()
 *  - didRender() will be triggered after render()
 *  - setState() this helps shallow merge changes and allow re-render
 */
class BaseUICustomElement<T = {}> extends BootstrapElement {
    [key: string]: any;

    static get is(): string {
        return this.element;
    }

    static get observedAttributes(): string[] {
        // console.log('observedAttributes');
        const observeAttrs = this.attributesToProps;

        return Object.keys(observeAttrs).filter((item) => observeAttrs[item].observe);
    }

    static withShadowDom = false;

    static element: string;

    static readonly attributesToProps: object;

    static define(elementName: string, options?: ElementDefinitionOptions | undefined): void {
        const { customElements } = window;
        const isElementExist = customElements.get(elementName);

        if (isElementExist) return;

        this.element = elementName;
        customElements.define(elementName, this, options);
    }

    state!: T;
    isFirstRender: boolean;
    isCreated: boolean;

    constructor() {
        super();

        this.isFirstRender = true;
        this.isCreated = false;
        this.create = this.create.bind(this);

        if ((this.constructor as typeof BaseUICustomElement).withShadowDom) {
            this.attachShadow({ mode: 'open' });
        }

        this.willConnect();
    }

    connectedCallback() {
        // delay execution of connectedCallback to make sure dynamic data added to the attributes are available to consume
        window.requestAnimationFrame(this.create);
        // this.create();
        // return Promise.resolve().then(() => this.create());
    }

    attributeChangedCallback(attrName: string, oldVal: any, newVal: any) {
        /**
         * to optimize and avoid unnecessary re-rendering when attribte values changed
         * this condition checks for below three things
         * {isCreated} check if element connected, if no, avoid re-render
         * {oldVal === newVal} check if current and new value for this attribute are same, if yes, then avoid re-render
         */
        if (!this.isCreated || oldVal === newVal) return;

        const propName = toCamelCase(attrName);

        /**
         * check if attribute changed due to removeAttribute or change of value
         * if removed, delete property set on element instance
         */
        if (newVal === null) {
            delete this[propName];
        }

        this.beforeRender();
    }

    handleEvent(e: Event) {
        const eventType = e.type;
        const hasInstanceMethod = `on${eventType}`;

        if (!this[hasInstanceMethod] || typeof this[hasInstanceMethod] !== 'function') return;

        this[hasInstanceMethod](e);
    }

    /* tslint:disable:no-empty */
    protected willConnect(): void {}
    protected onConnect(): void {}
    protected willRender(): void {}
    protected didRender(): void {}
    protected didConnect(): void {}
    protected render(properties: this): void {}
    /* tslint:enable:no-empty */

    protected setState(state: Partial<T> | ((this: this, state: T) => Partial<T>), render: boolean = true): void {
        const currentStateObj = this.state;
        const nextState = typeof state === 'function' ? state.call(this, currentStateObj) : state;
        this.state = { ...this.state, ...nextState };

        if (render) this.beforeRender();
    }

    private create() {
        const reflectedAttrToProps = (this.constructor as typeof BaseUICustomElement).attributesToProps;

        // poxy attributes & observed attributes as properties
        this.createAttributesToProperties(reflectedAttrToProps);

        this.isCreated = true;

        this.onConnect();
        this.beforeRender();
        this.setAttr('enhanced', '');
    }

    private beforeRender() {
        this.willRender();

        this.setAttr('is-rendering', '');
        this.render(this);
        this.afterRender();
    }

    private afterRender() {
        if (this.isFirstRender) {
            this.isFirstRender = false;
            this.didConnect();
        }

        this.removeAttr('is-rendering');
        this.didRender();
    }
}

export default BaseUICustomElement;
