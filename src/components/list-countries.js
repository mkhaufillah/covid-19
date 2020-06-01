"use strict";

import numeral from 'numeral';
import 'chart.js';
import { getStore } from '../store';
import './country';

class ListCountries extends HTMLElement {

    constructor() {
        super();
        const statistics = getStore('statistics');
        if (statistics != undefined)
            this.statistics = JSON.parse(statistics);
        const globalHistory = getStore('globalHistory');
        if (globalHistory != undefined)
            this.globalHistory = JSON.parse(globalHistory);
    }

    static get observedAttributes() {
        return ['data-filter'];
    }

    attributeChangedCallback(name, _oldValue, newValue) {
        if (name == 'data-filter') {
            this.filter(newValue);
            this.render();
            const statistics = this.querySelector('#statistics-new-cases');
            if (newValue != '') {
                statistics.style.display = 'none';
            } else {
                this.loadNewCasesChart();
                statistics.style.display = 'block';
            }
        }
    }

    connectedCallback() {
        this.filter(this.getAttribute('data-filter'));
        this.render();
        this.loadNewCasesChart();
    }

    filter(filter) {
        const statistics = JSON.parse(getStore('statistics'));
        this.statistics = statistics.filter(function (obj) {
            const re = new RegExp('^.*' + filter.toLowerCase() + '.*$');
            return obj.country.toLowerCase().match(re);
        });
    }

    render() {

        const lidx = this.globalHistory.length - 1;

        let newConfirmed = this.globalHistory[lidx].cases.new;
        let newDeaths = this.globalHistory[lidx].deaths.new;
        let totalConfirmed = this.globalHistory[lidx].cases.total;
        let totalDeaths = this.globalHistory[lidx].deaths.total;
        let totalRecovered = this.globalHistory[lidx].cases.recovered;

        let content = `

        <div class="m-1">
            <p>update every <span>15 minutes</span></p>
        </div>

        <div class="m-1 lshow-flex">
            <h4 class="yellow-text">New Confirmed <span class="yellow">${numeral(newConfirmed).format('0,0')}</span> Cases</h4>
            <h4> | </h4>
            <h4 class="red-text">New Deaths <span class="red">${numeral(newDeaths).format('0,0')}</span> Cases</h4>
            <h4> | </h4>
            <h4 class="grey-text">Highest Death Rate: <span class="grey">${this.getHighestDeathRate()}</span></h4>
            <h4> | </h4>
            <h4 class="grey-text">Highest Recovered Rate: <span class="grey">${this.getHighestRecoveredRate()}</span></h4>
        </div>

        <div class="m-1 mshow-flex mshow-flex">
            <h4 class="yellow-text">New Confirmed <span class="yellow">${numeral(newConfirmed).format('0,0')}</span> Cases</h4>
            <h4> | </h4>
            <h4 class="red-text">New Deaths <span class="red">${numeral(newDeaths).format('0,0')}</span> Cases</h4>
            <h4> | </h4>
            <h4 class="grey-text">Highest Death Rate: <span class="grey">${this.getHighestDeathRate()}</span></h4>
            <h4> | </h4>
            <h4 class="grey-text">Highest Recovered Rate: <span class="grey">${this.getHighestRecoveredRate()}</span></h4>
        </div>

        <div class="m-1 sshow-flex">
            <h4 class="yellow-text">New Confirmed <span class="yellow">${numeral(newConfirmed).format('0,0')}</span> Cases</h4>
            <h4> | </h4>
            <h4 class="red-text">New Deaths <span class="red">${numeral(newDeaths).format('0,0')}</span> Cases</h4>
        </div>

        <div class="m-1 sshow-flex">
            <h4 class="grey-text">Highest Death Rate: <span class="grey">${this.getHighestDeathRate()}</span></h4>
            <h4> | </h4>
            <h4 class="grey-text">Highest Recovered Rate: <span class="grey">${this.getHighestRecoveredRate()}</span></h4>
        </div>

        <div class="lshow-flex statistics" id="statistics-new-cases">
            <h2>NEW CASES TODAY</h2>
            <canvas id="new-cases-chart"></canvas>
        </div>

        <div class="m-1">
            <h4 class="yellow-text">Total Confirmed <span class="yellow">${numeral(totalConfirmed).format('0,0')}</span> Cases</h4>
            <h4> | </h4>
            <h4 class="red-text">Total Deaths <span class="red">${numeral(totalDeaths).format('0,0')}</span> Cases</h4>
            <h4> | </h4>
            <h4 class="green-text">Total Recovered <span class="green">${numeral(totalRecovered).format('0,0')}</span> Cases</h4>
        </div>

        `;
        let i = 1;
        for (let idx in this.statistics) {
            if (i == 1) content += '<div>';
            content += `<country-elem class="lshow" data-statistic='${JSON.stringify(this.statistics[idx])}'></country-elem>`;
            if (i == 3 || idx == this.statistics.length - 1) {
                content += '</div>';
                i = 0;
            }
            i++;
        }
        let ii = 1;
        for (let idx in this.statistics) {
            if (ii == 1) content += '<div>';
            content += `<country-elem class="mshow" data-statistic='${JSON.stringify(this.statistics[idx])}'></country-elem>`;
            if (ii == 2 || idx == this.statistics.length - 1) {
                content += '</div>';
                ii = 0;
            }
            ii++;
        }
        for (let idx in this.statistics) {
            content += '<div>';
            content += `<country-elem class="sshow" data-statistic='${JSON.stringify(this.statistics[idx])}'></country-elem>`;
            content += '</div>';
        }
        this.innerHTML = content;
    }

    loadNewCasesChart() {

        const dataLabels = [];
        const dataNewConfirmed = [];
        const dataNewDeaths = [];
        for (let idx in this.globalHistory) {
            dataLabels.push('');
            if ((this.globalHistory[idx].cases.new) != null)
                dataNewConfirmed.push(parseInt((this.globalHistory[idx].cases.new).replace('+', '')));
            else dataNewConfirmed.push(0);
            if ((this.globalHistory[idx].cases.new) != null)
                dataNewDeaths.push(parseInt((this.globalHistory[idx].deaths.new).replace('+', '')));
            else dataNewDeaths.push(0);
        }

        const data = {
            labels: dataLabels,
            datasets: [
                {
                    label: 'New Confirmed',
                    borderColor: '#d8e060',
                    data: dataNewConfirmed,
                    fill: false,
                },
                {
                    label: 'New Deaths',
                    borderColor: '#c03a3a',
                    data: dataNewDeaths,
                    fill: false,
                }
            ]
        };

        const ctx = document.getElementById('new-cases-chart');
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

    getHighestDeathRate() {
        const statistics = JSON.parse(getStore('statistics'));
        let statistic = null;
        for (let idx in statistics) {
            if (statistic == null) statistic = statistics[idx];
            if (((statistics[idx].deaths.total / statistics[idx].cases.total) * 100) > ((statistic.deaths.total / statistic.cases.total) * 100)) {
                statistic = statistics[idx];
            }
        }
        return statistic.country;
    }

    getHighestRecoveredRate() {
        const statistics = JSON.parse(getStore('statistics'));
        let statistic = null;
        for (let idx in statistics) {
            if (statistic == null) statistic = statistics[idx];
            if (((statistics[idx].cases.recovered / statistics[idx].cases.total) * 100) > ((statistic.cases.recovered / statistic.cases.total) * 100)) {
                statistic = statistics[idx];
            }
        }
        return statistic.country;
    }

}

customElements.define('list-countries', ListCountries);