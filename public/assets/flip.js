// $(function () {
//     setInterval(function () {
//         flip();
//     }, 5000);
// });

function flip() {
    document.querySelector('.flip-body').classList.add('flipped');
    setTimeout(function () {
        document.querySelector('.flip-body').classList.remove('flipped');
    }, 1000);
}

$(function () {
    setInterval(function () {
        flip();
    }, 5000);
});
