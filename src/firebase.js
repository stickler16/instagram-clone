import firebase from "firebase";

const firebaseApp =firebase.initializeApp({
    apiKey: "AIzaSyB6lEPKDZ6XTKyF15yXMZiisKPDDi3xxvs",
    authDomain: "instagram-clone-8e729.firebaseapp.com",
    projectId: "instagram-clone-8e729",
    storageBucket: "instagram-clone-8e729.appspot.com",
    messagingSenderId: "1056150333489",
    appId: "1:1056150333489:web:6194676b5c92ae9b088d10"
});

const db =firebaseApp.firestore();
const auth = firebase.auth();
const storage =firebase.storage();

export {db,auth,storage};

// https://mega.nz/folder/zFxwwb6Y#qCY6WxCd7FDIYFgKtuqP1g