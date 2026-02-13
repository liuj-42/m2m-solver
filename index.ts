/*
given the example url, parse the two movie ids:
https://movietomovie.com/play/1817/337339
-> 1817 and 337339
*/
function main() {
  let url = "https://movietomovie.com/play/1817/337339"; // valid movie id format
  // let url = "https://movietomovie.com/play/1817/"; // invalid movie id format
  let movieIds = url
    .split("play/")[1]
    .split("/")
    .map((id) => (id = parseInt(id)));
  if (movieIds.length != 2 || movieIds.some((id) => Number.isNaN(id))) {
    console.log("invalid url format");
    return;
  }
}

main();
if (false) {
  fetch("https://api.themoviedb.org/3/movie/581734/credits", {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log(res["cast"]);
    });
}
