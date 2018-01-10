import { render as renderFn, html } from 'lit-html/lib/lit-extended.js';
import BaseCustomElement from '../index.js';

/**
 * html(template)
 * *** @param {object} template literal which needs to be wired
 *
 * renderFn((template, renderRoot)
 * *** @param {object} template literal that needs to be rendered
 * *** @param {*} renderRoot defines where to render
 */
export { html, renderFn };

/**
 * HOC which uses litHtml underneath to render custome elements
 */
class BaseCustomElementWithLitHTML extends BaseCustomElement {
    get domRender() {
        return (...args) => renderFn(html(...args), this.renderRoot);
    }

    get html() { return html; }
}

export default BaseCustomElementWithLitHTML;