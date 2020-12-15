import { useSelector, useDispatch } from 'react-redux';
import {Button} from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import React from 'react';
import Axios from "axios";
import {addComment,removeComment} from './Redux/ActionCreators'
import './CommentModal.css'

export default function CommentModal(props){


    const store = useSelector(state => state); //hook provided by redux
    const dispatch = useDispatch();
    const headers = {  headers: { Authorization: 'Bearer ' + store.user_details.jwt }  }
  
 
    const [comment,setComment] = React.useState('')

    const sendComment = ()=>{
        
        props.setshow(false)
        Axios.post('http://localhost:5000/add_comment',{
            comment:comment,username:store.user_details.username,tweet_id:props.id,comment_time:new Date().toLocaleDateString()},
            headers)
        .then(res=>
            {
                dispatch(addComment({
                  comment:comment,username:store.user_details.username,tweet_id:props.id,comment_time:new Date().toLocaleDateString()}))

                console.log(res.data)

            })
            .catch(err =>
                {
              
                        console.log(err)         

                })

    }


  return(
<React.Fragment>
  <div className='mycomment'>
  <Modal
  show={props.show}
  size="lg"
  aria-labelledby="contained-modal-title-vcenter"
  centered
>
  <Modal.Header>
    <Modal.Title id="contained-modal-title-vcenter">
      Add a comment
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>

  <textarea
  className='commenttextarea container-fluid'
            placeholder="Type your comment here.."
            type="text"
            onChange={ e=> {setComment(e.target.value)} }
          />
   <span className='float-right'> <Button variant='success' disabled={comment.length==0} onClick={sendComment}>Comment</Button></span>

  </Modal.Body>
  <Modal.Footer>
    <Button variant='danger' onClick={ e => props.setshow(false)}>Close</Button>
  </Modal.Footer>
</Modal>
</div>
</React.Fragment>
);
}