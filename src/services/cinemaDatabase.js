export const getMovies = () => {
  return [
    { id: 1, title: 'Movie 1', genre: 'Action', releaseDate: '2025-05-01' },
    { id: 2, title: 'Movie 2', genre: 'Comedy', releaseDate: '2025-05-03' },
  ];
};

export const getShowtimes = (movieId) => {
  const showtimes = {
    1: ['10:00 AM', '1:00 PM', '4:00 PM'],
    2: ['11:00 AM', '2:00 PM', '5:00 PM'],
  };
  return showtimes[movieId] || [];
};