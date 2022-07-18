import { useState } from 'react';
import { Button } from '@material-ui/core';
import React from 'react';
import firebase from "firebase";
import { storage, db } from './firebase';
import './ImageUpload.css';

function ImageUpload({username}) {

    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress bar function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url=>{
                        // post inside db
                        db.collection("posts").add({
                            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                            caption:caption,
                            imageUrl:url,
                            username : username
                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
            }
        )
    }

    return (
        <div className="imageupload">          
            <progress className="imageupload__progress" value={progress}max="100"></progress>
            <input className="imageupload__caption" type="text" placeholder="Enter a caption...." onChange={event => setCaption(event.target.value)} value={caption} />
            <input type="file" className="imageupload__file" onChange={handleChange} />
            <Button className="imageupload__button"onClick={handleUpload}>
                Upload 
            </Button>


        </div>
    )
}

export default ImageUpload
