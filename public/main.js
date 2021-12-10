document.querySelectorAll(".nextQues").forEach(btn => btn.addEventListener("click", nextQuestion))

function nextQuestion(btn){
  let parentSection = btn.target.parentNode

  btn.target.parentNode.classList.toggle("hide")
  parentSection.nextElementSibling.classList.toggle("hide")
}
