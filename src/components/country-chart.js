"use strict";

import 'chart.js';
import './error';

class CountryChart extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        try {
            this.country = this.getAttribute('data-country');
            this.getData();
        } catch (err) {
            console.log(err);
            this.renderError('Data error silahkan refresh halaman.');
        }
    }

    async getData() {
        const d = new Date()
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
        const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
        try {
            const countryDetail = await fetch(
                `https://covid-193.p.rapidapi.com/history?day=${ye}-${mo}-${da}&country=${this.country}`,
                {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-host": "covid-193.p.rapidapi.com",
                        "x-rapidapi-key": "e2bb65362cmshdb259d8d6601a26p150fafjsn69717e7f9afe"
                    }
                });
            this.countryDetail = ((await countryDetail.json()).response).reverse();
            if (countryDetail.status == 200)
                this.renderData();
            else
                this.renderError('Data error silahkan refresh halaman.');
        } catch (err) {
            console.log(err);
            this.renderError('Data error silahkan refresh halaman.');
        }
    }

    renderData() {
        this.innerHTML = '<canvas id="new-cases-country-chart"></canvas>'
        this.loadCountryDetailChart();
    }

    renderError(errorData) {
        this.innerHTML = `

        <error-elem data-error="${errorData}"></error-elem>

        `;
    }

    loadCountryDetailChart() {

        const dataLabels = [];
        const dataNewConfirmed = [];
        const dataNewDeaths = [];
        for (let idx in this.countryDetail) {
            dataLabels.push('');
            if ((this.countryDetail[idx].cases.new) != null)
                dataNewConfirmed.push(parseInt((this.countryDetail[idx].cases.new).replace('+', '')));
            else dataNewConfirmed.push(0);
            if ((this.countryDetail[idx].deaths.new) != null)
                dataNewDeaths.push(parseInt((this.countryDetail[idx].deaths.new).replace('+', '')));
            else dataNewDeaths.push(0);
        }

        const data = {
            labels: dataLabels,
            datasets: [
                {
                    label: 'New Confirmed',
                    backgroundColor: 'rgba(215, 224, 96, 0.2)',
                    borderColor: '#d8e060',
                    data: dataNewConfirmed,
                },
                {
                    label: 'New Deaths',
                    backgroundColor: 'rgba(192, 58, 58, 0.2)',
                    borderColor: '#c03a3a',
                    data: dataNewDeaths,
                }
            ]
        };

        const ctx = document.getElementById('new-cases-country-chart');
        new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    x: {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Month'
                        }
                    },
                    y: {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        }
                    }
                }
            }
        });
    }

}

customElements.define('country-chart', CountryChart);