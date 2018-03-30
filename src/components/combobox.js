/**
 * Added accessibility functionalities for the filter combobox
 * - Roving focus
 * - Indication of the current element
 * @param {Element} el
 */
class ComboBox {
  constructor (el) {
    // Define values for keycodes
    this.VK_ENTER = 13
    this.VK_ESC = 27
    this.VK_SPACE = 32
    this.VK_LEFT = 37
    this.VK_UP = 38
    this.VK_RIGHT = 39
    this.VK_DOWN = 40

    this.LAST_ID = 0

    this.el = el
    // debugger //eslint-disable-line

    console.log(this.el)
    this.focusedIdx = 0

    // this.el.addEventListener('keydown', this.handleKeyDown)
    this.el.onkeydown = this.handleKeyDown
    this.oncaptureevent = this.handleChange
  }

  createDropdown (id) {

  }

  // Helper function to convert NodeLists to Arrays
  slice (nodes) {
    return Array.prototype.slice.call(nodes)
  }

  /** Update the options */
  setData () {
    this.options = this.slice(this.el.querySelectorAll('option'))
    this.options.forEach(element => {
      new ComboOption(element)
    })
    console.log(this.options)
  }

  handleKeyDown (e) {
    // debugger //eslint-disable-line
    console.log(e.keyCode)
    switch (e.keyCode) {
      case this.VK_DOWN: {
        e.preventDefault()
        console.log('down')
        this.focusedIdx === 0 ? this.focusedIdx = this.options.length - 1 : this.focusedIdx--
        console.log(this.focusedIdx)
      }
    }
  }

  handleChange (e) {
    console.log('change', e)
  }
}

class ComboOption {
  constructor (el) {
    this.el = el
    console.log('combo', el)
    el.onfocus = this.handleOnFocus
    el.onclick = this.handleClick
  }

  handleOnFocus (e) {
    console.log('onfocus', e)
  }

  handleClick (e) {
    console.log('onclick', e)
  }
}

export default ComboBox
