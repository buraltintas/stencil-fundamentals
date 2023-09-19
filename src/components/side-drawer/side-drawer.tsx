import { Component, Method, Prop, State } from "@stencil/core";
import { h } from "@stencil/core";

@Component({
    tag: 'bui-side-drawer',
    styleUrl: './side-drawer.css',
    shadow: true
})

export class SideDrawer {
    @State() showContact: boolean = false;
    @Prop({ reflect: true }) title: string;
    @Prop({ reflect: true, mutable: true }) opened: boolean = false;

    onClose() {
        this.opened = false;
    }

    onContentChange(content: string) {
        this.showContact = content === 'contact';
    }

    @Method()
    open() {
        this.opened = true;
    }

    render() {
        let content = <slot />;
        if (this.showContact) {
            content = (
                <div>
                    <span>Contact Us</span>
                    <ul>
                        <li>Phone: 328 428</li>
                        <li>Email: g@g.com</li>
                    </ul>
                </div>
            )
        }

        return [
            <div class="backdrop" onClick={this.onClose.bind(this)}></div>,
            <aside>
                <header>
                    <h1>{this.title}</h1>
                    <button onClick={this.onClose.bind(this)}>X</button>
                </header>
                <section id="tabs">
                    <button onClick={this.onContentChange.bind(this, 'nav')} class={!this.showContact && 'active'}>Navigation</button>
                    <button onClick={this.onContentChange.bind(this, 'contact')} class={this.showContact && 'active'}>Contact</button>
                </section>
                <main>
                    { content }
                </main>
            </aside>
        ]
    }
}