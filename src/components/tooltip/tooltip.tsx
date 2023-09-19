import { Component, Prop, State } from "@stencil/core";
import { h } from "@stencil/core";

@Component({
    tag: 'bui-tooltip',
    styleUrl: './tooltip.css',
    shadow: true
})
export class Tooltip {
    @Prop() body: string;
    @State() showTooltipBody: boolean = false;

    toggleTooltipBody() {
        this.showTooltipBody = this.showTooltipBody ? false : true; 
    }

    render() {
        return [
            <div class="tooltip-button" >
                <span onClick={this.toggleTooltipBody.bind(this)}>?</span>
                <div class={`tooltip-body ${this.showTooltipBody && 'active'}`}>{this.body}</div>
            </div>
        ]
    }
}