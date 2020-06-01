"use strict";

class Search extends HTMLElement {

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `

        <input type="text" placeholder="Type country name">

        `;
        this.changeCountries();
    }

    changeCountries() {
        const input = this.querySelector('input');

        input.addEventListener('keyup', function () {
            const listCountries = document.querySelector('list-countries');
            listCountries.setAttribute('data-filter', input.value);
        });
    }

}

customElements.define('search-elem', Search);