/*
given the example url, parse the two movie ids:
https://movietomovie.com/play/1817/337339
-> 1817 and 337339
*/

import type { Movie, Person } from "./types";

if (false) {
  // disabled while i get the main bfs logic done
  const movie_cache_path = "./movie_cache.json";
  const person_cache_path = "./person_cache.json";
  const movie_file = Bun.file(movie_cache_path);
  const person_file = Bun.file(person_cache_path);

  const MOVIE_CACHE = await movie_file.json();
  const PERSON_CACHE = await person_file.json();
} else {
  const MOVIE_CACHE = {};
  const PERSON_CACHE = {};
}

const VISITED_MOVIES = new Set();
const VISITED_PERSON = new Set();

async function main() {
  const url = "https://movietomovie.com/play/1817/337339"; // valid movie id format
  // let url = "https://movietomovie.com/play/1817/"; // invalid movie id format
  const movieIds = url.split("/").slice(-2).map(Number);
  if (!isValidMovieIds(movieIds, 2)) {
    console.log("invalid format");
    return;
  }
  // @ts-ignore
  console.log(await getCast(movieIds[0]));
  // const paths = await find_paths(movieIds)
  // console.log(paths)
}

async function find_paths(args: number[]) {
  console.log("find_paths function with the args:");
  console.log(args);
  const paths = [];
  for (let i = 0; i < args.length - 1; i++) {
    // @ts-ignore
    paths.push(await find_path(args[i], args[i + 1]));
  }
  return paths;
}

async function find_path(start: number, end: number) {
  // start and end are both movie ids
  // bfs

  /*

add [start] to queue
mark start as visited

while queue is not empty:
    path = pop from queue
    node = last item in path

    if node == end:
        return path

    for each neighbor of node:
        if neighbor not in visited:
            mark neighbor as visited
            add [path + neighbor] to queue



add [m:start] to queue 
add start to m:visited

while queue is not empty:
  path = queue.pop
  node = last node in path

  if node is a movie:
    if node == end:
      return path
    for all cast of node:
      if cast not in p:visited
      add [path + cast] to queue
  if node is a person:
    for all movies of node:
      if movie not in m:visited
      add [path + movie] to queue
*/

  let cast = await getCast(start);
  console.log(cast);
  cast.forEach(async (person: Person) => {
    const personId = person["id"];
    const name = person["name"];
    if (VISITED_PERSON.has(personId)) {
      return;
    }
    const movies = await getMovies(personId);
    if (movies.find((el: Movie) => el.id == end)) {
      console.log("found path");
    }
  });
}

function isValidMovieIds(
  ids: number[],
  minLength: number = 2,
): ids is number[] {
  return ids.length >= minLength && !ids.some((id) => Number.isNaN(id));
}

async function writeToMovieCache(movieId: number, cast: any) {
  // ideally incrementally write to the movie cache here instead of rewriting everything every time
  // functions will stay empty for the time being
  // maybe in the future switch away from files and use something like redis to avoid having to handle
  //  all of the reading/writing
}

async function writeToPersonCache(personId: number, movies: any) {}

async function tmdbRequest(url: string, options: Record<string, any> = {}) {
  if (options["headers"]) {
    options["headers"]["Authorization"] = `Bearer ${process.env.API_KEY}`;
  } else {
    options["headers"] = {
      Authorization: `Bearer ${process.env.API_KEY}`,
    };
  }
  return fetch(url, options).then((res) => res.json());
}

async function getCast(movieId: number) {
  if (MOVIE_CACHE[movieId]) {
    // cache hit
    return MOVIE_CACHE[movieId];
  } else {
    const cast = await tmdbRequest(
      `https://api.themoviedb.org/3/movie/${movieId}/credits`,
    );
    MOVIE_CACHE[movieId] = cast["cast"];
    writeToMovieCache(movieId, cast["cast"]);
    return cast["cast"];
  }
}

async function getMovies(personId: number) {
  if (PERSON_CACHE[personId]) {
    // cache hit
    return PERSON_CACHE[personId];
  } else {
    const movies = await tmdbRequest(
      `https://api.themoviedb.org/3/person/${personId}/movie_credits`,
    );
    console.log(movies);
    PERSON_CACHE[personId] = movies["cast"];
    writeToPersonCache(personId, movies["cast"]);
    return movies["cast"];
  }
}

main();
