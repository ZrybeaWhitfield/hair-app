const commentForm = document.querySelector('.comment');
const entirePost = document.querySelector('.post')
entirePost.addEventListener('submit', commentPost);
entirePost.addEventListener('click', showCommentBox);
function showCommentBox(e) {
    if (e.target.className === 'commentBox') {
        e.target.classList.add('hide');
        const div = e.target.closest('.post');
        const commentForm = div.querySelector('.comment');
        commentForm.classList.remove('hide');
    }
    else if (e.target.className === 'cancel') {
        const div = e.target.closest('.post');
        const commentForm = div.querySelector('.comment');
        const commentButton = div.querySelector('.commentBox');
        commentButton.classList.remove('hide');
        commentForm.classList.add('hide');
    }
}

function commentPost(e) {
    console.log(e.target);
    e.preventDefault();
    if (e.target.className === 'comment') {
        const comment = this.querySelector('.text').value;
        const postId = e.target.closest('.post').querySelector('a');
        fetch('createComment', {
            method: 'post',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                comment: comment,
                postId: postId.getAttribute('href').slice(9),
                timestamp: new Date(Date.now())
            })
        }).then(() => {window.location.reload() });
    }
}