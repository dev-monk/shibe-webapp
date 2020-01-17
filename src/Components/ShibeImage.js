import React, { Component } from 'react';

class ShibeImage extends Component {
  constructor (props) {
    super(props);
    this.wrapperRef = React.createRef ();
  }

  handleClick () {
    const wrapper = this.wrapperRef.current;
    wrapper.classList.toggle ('is-favourite');
    this.props.onClick (this.props.iid)
  }

    render () {
        return (
            <div ref={this.wrapperRef} className="image-item" key={this.props.iid} >
              <img src={this.props.url} alt="shiba" 
                  onClick={() => this.handleClick ()} />
              <img alt="heart" className="image-heart" src="http://www.pngall.com/wp-content/uploads/3/Heart-Background-PNG-Image.png" />
            </div>
          );
    }
}

export default ShibeImage;
