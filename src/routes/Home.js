import React, { useEffect, useState } from "react"
import { dbService, storageService } from "fbase";
import { useParams } from "react-router-dom";
import Tweet from "components/Tweet";
import {v4 as uuidv4} from "uuid"

function Home({ userObj }) {
    const [tweet, setTweet] = useState("");
    const [tweets, setTweets] = useState([]);
    const [attachment, setAttachment] = useState("");

    /*async function getTweets(){
        const dbTweets = await dbService.collection("tweets").get();
        dbTweets.forEach(function(document){
            const tweetObject = {
                ...document.data(),
                id: document.id                
            }
            setTweets((prev) => [tweetObject, ...prev]);
        });
    } */
    useEffect(()=>{
        dbService.collection("tweets").onSnapshot((snapshot) => {
            const tweetArray = snapshot.docs.map(doc => ({
                id: doc.id, 
                ...doc.data()
            }));
            console.log(tweetArray);
            setTweets(tweetArray);
        })
    }, [])

    async function onSubmit(event){
        event.preventDefault();

        let attachmentUrl = "";
        if(attachment !== ""){
            const attachmentRef = storageService
                .ref()
                .child(`${userObj.uid}/${uuidv4()}`); // uuid : random number
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }

        const tweetObj = {
            text: tweet,
            createdAt: Date.now(),
            createorId: userObj.uid,
            attachmentUrl
        }
        await dbService.collection("tweets").add(tweetObj);
        setTweet("");
        setAttachment("");
    }
    function onChange(event){
        const {target : {value}} = event; // event 안에있는 target안에 있는 value를 달라고 하는것.
        setTweet(value);
    }
    function onFileChange(event) {
        // console.log(event.target.files);
        const {target: {files}} = event;
        const theFile = files[0];
        const reader = new FileReader();
        console.log("reader : " + reader.onloadend);


        reader.onloadend = (finishedEvent) => { // 사진 업로드 취소하면 에러뜸.
            //console.log(finishedEvent);
            console.log(reader.onloadend);
            const {currentTarget: {result}} = finishedEvent;
            setAttachment(result);
        }
                   
        reader.readAsDataURL(theFile);
    }
    function onClearAttachment(){
        setAttachment("");
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input 
                    value={tweet} 
                    onChange={onChange} 
                    type="text" 
                    placeholder="What's on your mind?" 
                    maxLength={120} 
                />
                <input type="file" accept="image/*" onChange={onFileChange}/>
                <input type="submit" value="Tweet" /><br />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Cancel upload</button>
                    </div>
                )}
            </form>
            <div>
                {tweets.map(tweet => 
                    <Tweet 
                        key={tweet.id} 
                        tweetObj={tweet} 
                        isOwner={tweet.createorId === userObj.uid} 
                        // tweet를 만든사람과 userObj.uid가 같으면 true. 역은 false.
                    />
                )}
            </div>
        </div>
    )
}

export default Home;