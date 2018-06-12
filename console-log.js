void function() {
  'use strict';
  customElements.define('console-log', class ConsoleLog extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'});
      this._componentName = 'console-log';
      this._pushDown = true;
    }
    connectedCallback() {
      const colors = { green: '#a3eea0', yellow: 'yellow', orange: '#d19a66', blue: '#4ba7ef', magenta: '#df9cf3', red: '#f9857b', black: '#282c34', white: '#dbdff4'};
      const colorCss = Object.keys(colors).map(c => {
        return `:host .${c} { color: var(--${c}-color, ${colors[c]}); }
        ${this._componentName} .${c} { color: var(--${c}-color, ${colors[c]}); }`;
      }).join('\n');
      this.shadowRoot.innerHTML = `
    <style>
    :host pre { background-color: var(--background-color, ${colors.black}); color: var(--color, ${colors.white}); overflow: auto !important; }
    ${this._componentName} pre { background-color: var(--background-color, ${colors.black}); color: var(--color, ${colors.white}); overflow: auto !important; }
    :host([inline]) > pre { display: inline; }
    ${this._componentName}[inline] > pre { display: inline; }
    :host([fit]) > pre { width: fit-content; width: -moz-fit-content; width: -webkit-fit-content; }
    ${this._componentName}[fit] > pre { width: fit-content; width: -moz-fit-content; width: -webkit-fit-content; }
    ${colorCss}
    #${this._componentName}__pre { box-shadow: 0 2px 2px rgba(0, 0, 0, .3); overflow-y: scroll; padding: 5px; margin: 5px; }
    </style>
    <pre id="console-log__pre"><code id="console-log__code"></code></pre></div>
    `;
    this.preEl = this.shadowRoot.querySelector(`#${this._componentName}__pre`);
    this.codeEl = this.shadowRoot.querySelector(`#${this._componentName}__code`);
    this._refresh();
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.target.localName === this._componentName) this._refresh();
      }.bind(this));
    }.bind(this));
    observer.observe(this, { attributes: true, childList: true, characterData: true });
    }

    _refresh() {
      try {
        if (Array.from(this.attributes).map(item => item.name).includes('no-parse')) this.codeEl.innerHTML = this.textContent;
        else this.codeEl.innerHTML = this._syntaxHighlight(this.textContent);
        if (this._pushDown) this._scrollDown();
      } catch(e) {
        this.codeEl.innerHTML = `<span class='key'>${e}</span>`;
      }
    }

    log(...text) {
      let content = this.codeEl.textContent;
      this.codeEl.textContent = `${content}\n${text.join(', ')}`;
      this._scrollDown();
    }
    _scrollDown() {
      this.parentElement.scrollTo(0, this.codeEl.getBoundingClientRect().height);
    }
    _simpleColor(inputColor) {
      let color = '';
      switch (inputColor) {
        case '31':
          color = 'red';
          break;
        case '32':
          color = 'green';
          break;
        case '33':
          color = 'yellow';
          break;
        case '34':
          color = 'blue';
          break;
        case '35':
          color = 'magenta';
          break;
        case '36':
          color = 'cyan';
          break;
        case '37':
          color = 'white';
          break;
        default:
          color = '';
      }
      return color;
    }
    _xtermColor(colorCode) {
      const hexCodes  = ['000000','800000','008000','808000','000080','800080','008080','c0c0c0','808080','ff0000','00ff00','ffff00','0000ff','ff00ff','00ffff','ffffff','000000','00005f','000087','0000af','0000d7','0000ff','005f00','005f5f','005f87','005faf','005fd7','005fff','008700','00875f','008787','0087af','0087d7','0087ff','00af00','00af5f','00af87','00afaf','00afd7','00afff','00d700','00d75f','00d787','00d7af','00d7d7','00d7ff','00ff00','00ff5f','00ff87','00ffaf','00ffd7','00ffff','5f0000','5f005f','5f0087','5f00af','5f00d7','5f00ff','5f5f00','5f5f5f','5f5f87','5f5faf','5f5fd7','5f5fff','5f8700','5f875f','5f8787','5f87af','5f87d7','5f87ff','5faf00','5faf5f','5faf87','5fafaf','5fafd7','5fafff','5fd700','5fd75f','5fd787','5fd7af','5fd7d7','5fd7ff','5fff00','5fff5f','5fff87','5fffaf','5fffd7','5fffff','870000','87005f','870087','8700af','8700d7','8700ff','875f00','875f5f','875f87','875faf','875fd7','875fff','878700','87875f','878787','8787af','8787d7','8787ff','87af00','87af5f','87af87','87afaf','87afd7','87afff','87d700','87d75f','87d787','87d7af','87d7d7','87d7ff','87ff00','87ff5f','87ff87','87ffaf','87ffd7','87ffff','af0000','af005f','af0087','af00af','af00d7','af00ff','af5f00','af5f5f','af5f87','af5faf','af5fd7','af5fff','af8700','af875f','af8787','af87af','af87d7','af87ff','afaf00','afaf5f','afaf87','afafaf','afafd7','afafff','afd700','afd75f','afd787','afd7af','afd7d7','afd7ff','afff00','afff5f','afff87','afffaf','afffd7','afffff','d70000','d7005f','d70087','d700af','d700d7','d700ff','d75f00','d75f5f','d75f87','d75faf','d75fd7','d75fff','d78700','d7875f','d78787','d787af','d787d7','d787ff','d7af00','d7af5f','d7af87','d7afaf','d7afd7','d7afff','d7d700','d7d75f','d7d787','d7d7af','d7d7d7','d7d7ff','d7ff00','d7ff5f','d7ff87','d7ffaf','d7ffd7','d7ffff','ff0000','ff005f','ff0087','ff00af','ff00d7','ff00ff','ff5f00','ff5f5f','ff5f87','ff5faf','ff5fd7','ff5fff','ff8700','ff875f','ff8787','ff87af','ff87d7','ff87ff','ffaf00','ffaf5f','ffaf87','ffafaf','ffafd7','ffafff','ffd700','ffd75f','ffd787','ffd7af','ffd7d7','ffd7ff','ffff00','ffff5f','ffff87','ffffaf','ffffd7','ffffff','080808','121212','1c1c1c','262626','303030','3a3a3a','444444','4e4e4e','585858','626262','6c6c6c','767676','808080','8a8a8a','949494','9e9e9e','a8a8a8','b2b2b2','bcbcbc','c6c6c6','d0d0d0','dadada','e4e4e4','eeeeee'];
      return `#${hexCodes[colorCode]}`;
    }
    _colorReplacer(match, d1, d2, d3, offset, string) {
      const parts = match.split('[')[1].split('m')[0].split(';');
      console.log(parts.length);
      console.log(parts);
      let color = '';
      let style = '';
      const isXterm = (parts[0] === '38' || parts[0] === '48') && parts[1] === '5';
      const isTrueColor = (parts[0] === '38' || parts[0] === '48') && parts[1] === '2';
      let colorType = parts[0] === '38' ? 'color' : 'background'; // only applies to xterm/truecolor
      if (parseInt(parts[0], 10) >= 30 && parseInt(parts[0], 10) <= 37) color = this._simpleColor(parts[0]);
      else if (isXterm) {
        style = `style="${colorType}: ${this._xtermColor(parts[2])}"`;
      } else if (isTrueColor) {
        style = `style="${colorType}: rgb(${parts[2]},${parts[3]},${parts[4]})"`;
      }
      return !isXterm && !isTrueColor && color === '' ? '</span>' : `<span ${style} class="${color}">`;
    }
    _adjustColor(content, useColor = true) {
      const color = /\x1b\[((\d+);?)+(\d+)*m/;
      const regex = new RegExp(color, 'g');
      return content.replace(regex, useColor ? this._colorReplacer.bind(this) : '');
    }
    _syntaxHighlight(content) {
      return this._adjustColor(content, true);
    }
  })
}();
