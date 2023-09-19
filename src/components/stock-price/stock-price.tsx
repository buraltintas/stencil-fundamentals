import { Component, h, State, Element, Prop, Watch, Listen } from '@stencil/core';
import { AV_API_KEY } from '../../global/global';

@Component({
  tag: 'bui-stock-price',
  styleUrl: './stock-price.css',
  shadow: true
})
export class StockPrice {
    stockInput: HTMLInputElement;
    @Element() el: HTMLElement;
    @State() fetchedPrice: number;
    @State() stockUserInput: string;
    @State() stockInputValid = false;
    @State() error: string;
    @State() loading = false;
    @Prop({mutable: true, reflect: true}) stockSymbol: string;

    @Watch('stockSymbol')
    stockSymbolChanged(newValue: string, oldValue: string) {
        if (newValue !== oldValue) {
            this.stockUserInput = newValue;
            this.fetchStockPrice(newValue);
        }
    }

    componentWillLoad() {
        console.log('componentWillLoad');
    }

    componentDidLoad() {
        console.log('componentDidLoad');
    }

    componentWillUpdate() {
        console.log('componentWillUpdate');
    }

    componentDidUpdate() {
        console.log('componentDidUpdate');
    }

    disconnectedCallback() {
        console.log('componentDidUnload');
    }

    @Listen('buiSymbolSelected', { target: 'body' })
    onStockSymbolSelected(event: CustomEvent) {
        if (event.detail && event.detail !== this.stockSymbol) {
            this.stockSymbol = event.detail;
        }
    }

    onUserInput(event: Event) {
        this.stockUserInput = (event.target as HTMLInputElement).value;
        if (this.stockUserInput.trim().length > 0) {
            this.stockInputValid = true;
        } else {
            this.stockInputValid = false;
        }
    }

    onFetchStockPrice(event: Event) {
        event.preventDefault();
        // const stockSymbol = (this.el.shadowRoot.querySelector('#stock-symbol') as HTMLInputElement).value;
        this.stockSymbol = this.stockInput.value;
        // this.fetchStockPrice(stockSymbol);
    }

    fetchStockPrice(stockSymbol: string) {
        this.loading = true;
        fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
        .then( res => {
            return res.json()
        })
        .then(res => {
            if (!res['Global Quote']?.['05. price']) {
                throw new Error('Something went wrong!')
            }
            this.fetchedPrice = +res['Global Quote']['05. price']
            this.error = null;
            this.loading = false;
        })
        .catch( err => {
            this.error = err.message;
            this.loading = false;
        } );
    }

    hostData() {
        return { class: this.error ? 'error' : '' }
    }

    render() {
        let dataContent = <p>Price: ${this.fetchedPrice}</p>;
        if (this.error) {
            dataContent = <p>{this.error}</p>
        }
        if (this.loading) {
            dataContent = <bui-spinner></bui-spinner>
        }

        return [
            <form onSubmit={this.onFetchStockPrice.bind(this)}>
                <input 
                    id="stock-symbol" 
                    ref={el => this.stockInput = el} 
                    value={this.stockUserInput}
                    onInput={this.onUserInput.bind(this)}
                />
                <button type="submit" disabled={!this.stockInputValid || this.loading}>Fetch</button>
            </form>,
            <div>{dataContent}</div>
        ];
    }
}