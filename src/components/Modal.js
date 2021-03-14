import React, {Component} from 'react';


export default class Modal extends Component{
  constructor(props){
    super(props);

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.modalRef = React.createRef();
  }


  componentDidMount(){
    document.addEventListener("mousedown",this.handleClickOutside);
  }

  componentWillUnmount(){
    document.removeEventListener("mousedown",this.handleClickOutside);
  }


  handleClickOutside(e){
    if(this.modalRef &&  !e.path.includes(this.modalRef.current)){
      // console.log(this.modalRef)
      // console.log(e.path);
      // console.log('outside detected');
      this.handleClose();
    }
  }

  handleClose = (e) =>{
    // console.log('closing');
    this.props.onClose && this.props.onClose(e);
  }

  handleDelete = (e) =>{
    // console.log('deleting');
    this.props.onDelete && this.props.onDelete(e);
  }
  
  

  render(){
    if(!this.props.visible){
      return null;
    }
    return (
      <div id = "modal_background" ref ={this.modalRef}>
        <h1>Hello THis is a Modal</h1>
        <button onClick = {this.handleDelete}>Delete</button>
        <button onClick = {this.handleClose}>Close</button>
      </div>
      )
    
    
    
  }


}