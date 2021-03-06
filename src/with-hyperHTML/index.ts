import { bind, wire } from 'hyperhtml/esm';
import { default as BaseUICustomElement } from '../base-component/custom-element';
/**
 *
 * @param {array} template literal that needs to be wired
 */
export const html = (template: TemplateStringsArray, ...values: any[]) => wire()(template, ...values);

/**
 *
 * To render and update nodes multiple times, bind object as context
 * ex: `items.map(item => htmlWithContext(item)`<li>${item.val}</li>`);`
 * here each item is bound as context to avoid rerendering same template
 */
export const htmlWithContext = wire;

/**
 *
 * @param {object} template literal that needs to be rendered
 * @param {HTMLElement} renderRoot defines where to render
 */
export const renderFn = (template: TemplateStringsArray, renderRoot: HTMLElement) => bind(renderRoot)(template);

/**
 * DOM rendering with HyperHTML which extendes from base custom element
 */
export class Component<T = {}> extends BaseUICustomElement<T> {
    get domRender() {
        return (template: TemplateStringsArray, ...values: any[]) => bind(this.shadowRoot || this)(template, ...values);
    }

    get html() {
        return html;
    }
    get htmlWithContext() {
        return htmlWithContext;
    }
}

export default {
    Component,
    html,
    htmlWithContext
};
