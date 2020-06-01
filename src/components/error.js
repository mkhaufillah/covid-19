"use strict";

class Error extends HTMLElement {

    static get observedAttributes() {
        return ['data-error'];
    }

    attributeChangedCallback(_name, _oldValue, newValue) {
        this.dataError = newValue;
        this.render();
    }

    connectedCallback() {
        this.dataError = this.getAttribute('data-error');
        this.render();
    }

    render() {
        this.innerHTML = `

        <div class="error">
            <p>${this.dataError}</p>
        </div>

        `;
    }

}

customElements.define('error-elem', Error);