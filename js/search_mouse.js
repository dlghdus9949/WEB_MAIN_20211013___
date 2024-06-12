const search = document.querySelector('.searchbox');

// 버튼에 마우스 올려놨을 때
search.addEventListener('mouseover', () => {
/*     search.style.border = '3px solid #1582ff';
    search.style.backgroundColor = '#000'; */
    search.style.transform = 'scale(1.3)';
});
//마우스 벗어났을 때
search.addEventListener('mouseout', () => {
    /* search.style.border = 'none';
    search.style.backgroundColor = '#1582ff'; */
    search.style.transform = 'scale(1)';
});