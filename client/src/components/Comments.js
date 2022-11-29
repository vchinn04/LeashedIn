import React from "react";
import { Button, Comment, Form, Header } from 'semantic-ui-react'
import { Container } from "react-bootstrap";
import Image from "react-bootstrap/Image";


const Comments = ({
    id
}) => {

    const [val, setVal] = React.useState("")
    const [comsarr, setComs] = React.useState([])
    async function onSubmit() {

        // POST request using fetch with async/await
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: id, comment: val })
        };
        const response = await fetch('http://localhost:4000/comment/post', requestOptions);
        const data = await response.json();
        console.log(data)
        setComs([])
        setVal("")
        onLoad();
    };

    async function onLoad() {
        // POST request using fetch with async/await
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postID: id })
        };
        let postNames = []
        const response = await fetch('http://localhost:4000/comment/get', requestOptions);
        const data = await response.json();
        let arr = data.comments
        console.log(arr)
        for (const element of arr) {
            if (!postNames.includes(element.comment.toString())) {
                setComs(postsArr => [...postsArr,
                <div>
                    <Comment className="comment" key={element.comment}>
                        <Comment.Content>
                            <Comment.Author className="author">{element.username}</Comment.Author>
                            <Comment.Metadata className="date">
                                <div>{new Date(element.createdAt).toDateString()}</div>
                            </Comment.Metadata>
                            <Comment.Text className="com">{element.comment}</Comment.Text>
                        </Comment.Content>
                    </Comment>
                </div>
                ]);
                postNames.push(element.comment.toString())
            }
        }
    }

    const [set, setT] = React.useState(false)
    if (!set) {
        onLoad()
        setT(true)
    }




    return (
        <Comment.Group>
            <Header className="comment" as='h3' dividing>
                Comments
            </Header>

            <div>{comsarr}</div>

            <Form className="comment" reply>
                <Form.TextArea value={val} onChange={e => setVal(e.target.value)} />
                <Button content='Add Comment' labelPosition='left' icon='edit' primary onClick={onSubmit} />
            </Form>
        </Comment.Group>
    );
};
export default Comments;
