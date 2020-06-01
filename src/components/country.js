"use strict";

import numeral from 'numeral';
import './country-chart';

class Country extends HTMLElement {

    constructor() {
        super();
        this.isOpen = false;
    }

    static get observedAttributes() {
        return ['data-statistic'];
    }

    attributeChangedCallback(name, _oldValue, newValue) {
        if (name == 'data-statistic') this.statistic = JSON.parse(newValue);
        this.render();
    }

    connectedCallback() {
        try {
            this.statistic = JSON.parse(this.getAttribute('data-statistic'));
        } catch { }
        this.render();
        this.addEventListener('click', this.openCountry.bind(this));
    }

    render() {
        this.innerHTML = `

        <div class="card">
            <h4>${this.statistic.country}</h4>
            <div>
                <p class="yellow">${numeral(this.statistic.cases.total).format('0,0')} Cases</p>
                <p class="red">${numeral(this.statistic.deaths.total).format('0,0')} Cases</p>
                <p class="green">${numeral(this.statistic.cases.recovered).format('0,0')} Cases</p>
            </div>
            <p>
                Death Rate <span class='red'>${numeral((this.statistic.deaths.total / this.statistic.cases.total) * 100).format('0,0.000')}%</span>
                <br /><br />
                Recovery Rate <span class='green'>${numeral((this.statistic.cases.recovered / this.statistic.cases.total) * 100).format('0,0.000')}%</span>
            </p>
        </div>

        `;
    }

    openCountry() {
        const card = this.querySelector('.card');
        if (!this.isOpen) {
            this.classList.add('open');
            this.isOpen = true;
            this.tempCard = card.innerHTML;
            card.innerHTML = `
                
                <h1>${this.statistic.country}</h1>
                <country-chart data-country='${this.statistic.country}'></country-chart>
                
                `;
        } else {
            this.classList.remove('open');
            this.isOpen = false;
            card.innerHTML = this.tempCard;
        }
    }

}

customElements.define('country-elem', Country);