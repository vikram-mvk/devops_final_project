import { useSelector, useDispatch } from 'react-redux';
import {Button} from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import React from 'react';
import Axios from "axios";
import {addComment,removeComment} from './Redux/ActionCreators'
import { Avatar } from "@material-ui/core";
import './CommentModal.css'

export default function LikesModal(props){

  return(
<React.Fragment>
  <div className='mycomment'>
  <Modal
  show={props.show}
  size="lg"
  aria-labelledby="contained-modal-title-vcenter2"
  centered
>
  <Modal.Header>
    <Modal.Title id="contained-modal-title-vcenter2">
    Liked by:
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <div className='mycommenttextarea container-fluid'>
    {
        props.likes.length >0 ? props.likes.map( x => {

            return(
   <div className="post__avatar" style={{display:'inline-block'}}>
          <Avatar src={'https://vikram-twitter-clone.s3.amazonaws.com/'+x} />
      
            <span className=' text-left bg-light h4 '>{x}</span>
            </div>
            )

        }
        
        )
        :'No likes yet'
    }
</div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant='danger' onClick={ e => props.setshow(false)}>Close</Button>
  </Modal.Footer>
</Modal>
</div>
</React.Fragment>
);
}