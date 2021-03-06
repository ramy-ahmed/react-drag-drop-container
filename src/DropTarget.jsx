import React from 'react';

class DropTarget extends React.Component {
  constructor(props) {
    super(props);
    this.elem = null;
    this.state = {highlighted: false};
  }

  componentDidMount() {
    this.elem.addEventListener(`${this.props.targetKey}DragEnter`, this.handleDragEnter, false);
    this.elem.addEventListener(`${this.props.targetKey}DragLeave`, this.handleDragLeave, false);
    this.elem.addEventListener(`${this.props.targetKey}Drop`, this.handleDrop, false);
  }

  createEvent(eventName, eventData) {
    // utility to create an event
    let e;
    if (typeof window.CustomEvent !== 'function') {
      // we are in IE 11 and must use old-style method of creating event
      e = document.createEvent('CustomEvent');
      e.initCustomEvent(eventName, true, true, {});
    } else {
      e = new CustomEvent(eventName, { bubbles: true, cancelable: true });
    }
    Object.assign(e, eventData);
    return e;
  }

  handleDrop = (e) => {
    // tell the drop source about the drop, then do the callback
    const evt = this.createEvent(
      `${this.props.targetKey}Dropped`,
      {
        dragData: e.dragData,
        dropElem: this.elem,
        dropData: this.props.dropData,
      },
    );
    e.containerElem.dispatchEvent(evt);
    this.props.onHit(e);
    this.setState({highlighted: false})
  }

  handleDragEnter = (e) => {
    console.log('enter')
    const _e = e;
    this.props.highlightClassName && this.setState({highlighted: true})
    this.props.onDragEnter(_e);
  }

  handleDragLeave = (e) => {
    const _e = e;
    this.props.highlightClassName && this.setState({highlighted: false})
    this.props.onDragLeave(_e);
  }

  render() {
    return (
      <span ref={(t) => { this.elem = t; }} className={this.state.highlighted ? this.props.highlightClassName : ''}>
        {this.props.render ? this.props.render() : this.props.children}
      </span>
    );
  }
}

DropTarget.propTypes = {
  children: React.PropTypes.node,
  render: React.PropTypes.func,
  highlightClassName: React.PropTypes.string,

  // needs to match the targetKey in the DragDropContainer -- matched via the enter/leave/drop event names, above
  targetKey: React.PropTypes.string,

  // data that gets sent back to the DragDropContainer and shows up in its onDrop() callback event
  dropData: React.PropTypes.object,

  // callbacks
  onDragEnter: React.PropTypes.func,
  onDragLeave: React.PropTypes.func,
  onHit: React.PropTypes.func,
};

DropTarget.defaultProps = {
  children: null,
  targetKey: 'ddc',
  onDragEnter: () => {},
  onDragLeave: () => {},
  onHit: () => () => {},
  dropData: {},
  highlightClassName: 'highlighted',
  render: null,
};

export default DropTarget;
