fetch("https://target1.p.rapidapi.com/auto-complete?q=macbook%20air", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "target1.p.rapidapi.com",
		"x-rapidapi-key": "debbcdaba9mshb3d34651e91269fp1ba2c3jsn533fb317c4c5"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.error(err);
});
