import { createTemplate } from "./createTemplate.js";

const template = createTemplate(`
  <template>
    <style>
      :host {
        display: inline-block;
      }
    </style>
  
    <canvas></canvas>
  </template>
`)

export class DollarBill extends HTMLElement {
  static get observedAttributes() {
    return [
      'amount',
      'width',
      'height'
    ]
  }

  constructor() {
    super()
    const templateContent = template.content
    this._shadowRoot = this.attachShadow({mode: 'closed'})
    this._shadowRoot.appendChild(templateContent.cloneNode(true))
    this._context = this._getCanvas().getContext('2d')
    this._render()
  }

  attributeChangedCallback(name, oldValue, value) {
    switch (name) {
      case 'amount':
        if (value !== oldValue) {
          this._amount = parseInt(value, 10)
          this._render()
        }
        break
      case 'width':
        this._getCanvas().width = value
        this._render()
        break
      case 'height':
        this._getCanvas().height = value
        this._render()
        break
    }
  }

  _getCanvas() {
    return this._shadowRoot.querySelector('canvas')
  }

  _render() {
    const canvas = this._getCanvas()
    const borderWidth = 1
    this._context.fillStyle = 'black'
    this._context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    )
    this._context.fillStyle = 'green'
    this._context.fillRect(
      borderWidth,
      borderWidth,
      canvas.width - 2 * borderWidth,
      canvas.height - 2 * borderWidth
    )

    this._context.fillStyle = 'white'
    this._context.font = '112px sans-serif'
    const text = `$${this._amount}`
    const textMetrics = this._context.measureText(text)
    const textHeight = textMetrics.actualBoundingBoxAscent +
      textMetrics.actualBoundingBoxDescent
    this._context.fillText(
      text,
      0.5 * (canvas.width - textMetrics.width),
      0.5 * (canvas.height - textHeight) + textMetrics.actualBoundingBoxAscent
    )
  }
}
