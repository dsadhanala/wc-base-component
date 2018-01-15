/**
 * set context to allow CE polyfill work as expected
 */
export class HTMLCustomElement extends HTMLElement {
    constructor(_) { return (_ = super(_)).init(), _; } // eslint-disable-line
    init() { } // eslint-disable-line
}

/**
 * serialize attribute value from string to number/object/boolean/null or string
 * this also checks if the given attribute is a boolean attribute(named as `has-*`) without value, then returns as boolean
 * @param {string} attrName key/name of the attribute
 * @param {string} value of the attribute that needs to be serialize
 * @return {any} based on the type of the given value, it will be parsed and sent as that type
 */
export function serializeAttrValue(attrName, value) {
    const isObjOrArray = (/^[{|[]/g).test(value);
    const hasOrIsBooleanAttr = (/^has-|^is-/g).test(attrName);
    let updatedValue;

    // parse attributue value
    try {
        updatedValue = JSON.parse(value);
    } catch (e) {
        updatedValue = value;

        if (isObjOrArray) {
            updatedValue = null;
            console.error(`Warning: Failed serializing attribute(${attrName}) value as JSON: ${value}`);
        }
    }

    // check for has-* or is-* attributes
    if (hasOrIsBooleanAttr) {
        updatedValue = hasOrIsBooleanAttr;
    }

    return updatedValue;
}

/**
 * trigger native/custom event and pass data between components
 * @param {object} target element reference on which event needs to be triggerd
 * @param {string} eventName custom event name
 * @param {object} eventData custom event data to share
 */
export function trigger(eventName, target, eventData) {
    const triggerEvent = (!eventData) ? new Event(eventName) : new CustomEvent(eventName, { detail: eventData || {} });
    target.dispatchEvent(triggerEvent);
}

/**
 * Converts string hyphennated to camelcase
 * @param {string} word data that passed to the function
 * @return {string} word converted string
 */
export function toCamelCase(word) {
    return word.replace(/\b(_|-)([a-z])/g, (s, f, c) => c.toUpperCase());
}
