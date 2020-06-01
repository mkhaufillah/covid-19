"use strict";

import './index.scss';
import { setStore } from './store';
import './components/search';
import './components/list-countries';
import './components/spinner';
import './components/error';

class Container extends HTMLElement {

    connectedCallback() {
        this.year = (new Date()).getFullYear();
        this.renderSpinner();
        this.getData();
    }

    renderSpinner() {
        this.innerHTML = '<spinner-elem></spinner-elem>';
    }

    async getData() {
        try {
            const statistics = await fetch(
                "https://covid-193.p.rapidapi.com/statistics",
                {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-host": "covid-193.p.rapidapi.com",
                        "x-rapidapi-key": "e2bb65362cmshdb259d8d6601a26p150fafjsn69717e7f9afe"
                    }
                });
            const d = new Date()
            const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
            const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
            const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)

            const globalHistory = await fetch(
                `https://covid-193.p.rapidapi.com/history?day=${ye}-${mo}-${da}&country=all`,
                {
                    method: "GET",
                    headers: {
                        "x-rapidapi-host": "covid-193.p.rapidapi.com",
                        "x-rapidapi-key": "e2bb65362cmshdb259d8d6601a26p150fafjsn69717e7f9afe"
                    }
                });
            setStore(
                'statistics',
                JSON.stringify(((await statistics.json()).response).sort(
                    function (a, b) {
                        var x = a.country.toLowerCase();
                        var y = b.country.toLowerCase();
                        if (x < y) { return -1; }
                        if (x > y) { return 1; }
                        return 0;
                    }
                ))
            );
            setStore(
                'globalHistory',
                JSON.stringify(((await globalHistory.json()).response).reverse())
            );
            if (statistics.status == 200 && globalHistory.status == 200)
                this.renderData();
            else
                this.renderError('Data error silahkan refresh halaman.');
        } catch (err) {
            console.log(err);
            this.renderError('Data error silahkan refresh halaman.');
        }
    }

    renderData() {
        this.innerHTML = `

        <header>
            <h1>COVID 19 <span>GLOBAL statistics</span></h1>
        </header>
        <main>
            <search-elem></search-elem>
            <br/>
            <list-countries data-filter=""></list-countries>
        </main>
        <footer>
            <p>data by <a target="_blank" href="https://api-sports.io/documentation/covid-19">api-sports</a></p>
            <p>copyright &copy; ${this.year} by mkhaufillah</p>
        </footer>

        `;
    }

    renderError(errorData) {
        this.innerHTML = `

        <error-elem data-error="${errorData}"></error-elem>

        `;
    }

}

customElements.define('container-elem', Container);