import React, { useEffect, useState } from "react"; 

/*
reference: https://dhanrajsp.me/blog/adding-comments-to-my-blog
*/

const commentNodeId = "comments";

const Comments = () => {


  useEffect(()=> {

     const script = document.createElement("script");
     script.src = "https://utteranc.es/client.js";
     script.async = true;
     script.setAttribute("repo", "yourankim/yourandev-gatsby");
     script.setAttribute("issue-term", "pathname");
     script.setAttribute("label", "post");
     script.setAttribute("theme", "github-light");
     script.setAttribute("crossorigin", "anonymous");

     const scriptParentNode = document.getElementById(commentNodeId);
     scriptParentNode.appendChild(script);

     return () => {
       scriptParentNode.removeChild(scriptParentNode.firstChild);
     }
  }, []);

   return <section id={commentNodeId} />;

}

export default Comments;