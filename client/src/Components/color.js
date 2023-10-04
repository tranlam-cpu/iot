import React from 'react'
import { SketchPicker } from 'react-color'
import reactCSS from 'reactcss'


class ColorPicker extends React.Component {
    
    state = {
      showPicker: false,
      color: {
        r: '255',
        g: '255',
        b: '255',
        a: '100',
      },
    };
 
    onClick = () => {
        this.setState({ 
          showPicker: !this.state.showPicker 
        })
    };
 
    onClose = () => {
      this.setState({ 
        showPicker: false 
      })
    };
 
    onChange = (color) => {
        this.setState({ 
          color: color.rgb 
        })
    };
    
    componentToHex(c) {
      var hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }

    rgbToHex(r, g, b) {
      return "0x" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    render() {
 
      const styles = reactCSS({
        'default': {
          color: {
            width: '40px',
            height: '15px',
            borderRadius: '3px',
            background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
          },
          popover: {
            position: 'absolute',
            zIndex: '3',
          },
          cover: {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
          },
          swatch: {
            padding: '6px',
            background: '#ffffff',
            borderRadius: '2px',
            cursor: 'pointer',
            display: 'inline-block',
            boxShadow: '0 0 0 1px rgba(0,0,0,.2)',
          },          
        },
      });
      


      return (
        <div>
          <div style={ styles.swatch } onClick={ this.onClick }>
          <input id="mau" readOnly value={this.rgbToHex(this.state.color.r,this.state.color.g,this.state.color.b)} hidden/>
            <div style={ styles.color } />
          </div>
          { this.state.showPicker ? <div style={ styles.popover }>
            <div style={ styles.cover } onClick={ this.onClose }/>
            <SketchPicker color={ this.state.color } onChange={ this.onChange } />
          </div> : null }
 
        </div>
      )
    }
}
 
export default ColorPicker