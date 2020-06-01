"use strict";

class Spinner extends HTMLElement {

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `

        <div>
            <div>
                <div>
                    <div>
                        <div>
                            <div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        `;
    }

}

customElements.define('spinner-elem', Spinner);