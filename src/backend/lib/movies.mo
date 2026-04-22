import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/movies";

module {
  public type Movie = Types.Movie;
  public type MovieInput = Types.MovieInput;

  /// Initialize movie store with 6 seeded demo movies
  public func initMovies() : List.List<Movie> {
    let now = Time.now();
    let movies = List.empty<Movie>();
    movies.add({
      id = 1;
      title = "Inception";
      description = "A thief who enters the dreams of others to steal secrets";
      category = "Sci-Fi";
      thumbnailUrl = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop";
      videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
      duration = "2h 28m";
      rating = 4.8;
      cast = ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"];
      isPremium = false;
      isTrending = true;
      isTopRated = false;
      createdAt = now;
    });
    movies.add({
      id = 2;
      title = "The Matrix";
      description = "A computer hacker learns about the true nature of reality";
      category = "Action";
      thumbnailUrl = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop";
      videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
      duration = "2h 16m";
      rating = 4.7;
      cast = ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"];
      isPremium = false;
      isTrending = false;
      isTopRated = true;
      createdAt = now;
    });
    movies.add({
      id = 3;
      title = "Interstellar";
      description = "A team of explorers travel through a wormhole in space";
      category = "Sci-Fi";
      thumbnailUrl = "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop";
      videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
      duration = "2h 49m";
      rating = 4.9;
      cast = ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"];
      isPremium = false;
      isTrending = false;
      isTopRated = true;
      createdAt = now;
    });
    movies.add({
      id = 4;
      title = "Dune";
      description = "A noble family becomes embroiled in a war for control of the universe";
      category = "Sci-Fi";
      thumbnailUrl = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop";
      videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
      duration = "2h 35m";
      rating = 4.6;
      cast = ["Timothée Chalamet", "Zendaya", "Oscar Isaac"];
      isPremium = true;
      isTrending = true;
      isTopRated = false;
      createdAt = now;
    });
    movies.add({
      id = 5;
      title = "Oppenheimer";
      description = "The story of American scientist J. Robert Oppenheimer and the atomic bomb";
      category = "Drama";
      thumbnailUrl = "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=600&fit=crop";
      videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
      duration = "3h 0m";
      rating = 4.8;
      cast = ["Cillian Murphy", "Emily Blunt", "Matt Damon"];
      isPremium = true;
      isTrending = true;
      isTopRated = false;
      createdAt = now;
    });
    movies.add({
      id = 6;
      title = "Killers of the Flower Moon";
      description = "Members of the Osage Nation are murdered under mysterious circumstances";
      category = "Drama";
      thumbnailUrl = "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop";
      videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
      duration = "3h 26m";
      rating = 4.7;
      cast = ["Leonardo DiCaprio", "Robert De Niro", "Lily Gladstone"];
      isPremium = true;
      isTrending = false;
      isTopRated = false;
      createdAt = now;
    });
    movies;
  };

  /// Get all movies
  public func getAll(movies : List.List<Movie>) : [Movie] {
    movies.toArray();
  };

  /// Get a single movie by id
  public func getById(movies : List.List<Movie>, id : Nat) : ?Movie {
    movies.find(func(m) { m.id == id });
  };

  /// Get trending movies
  public func getTrending(movies : List.List<Movie>) : [Movie] {
    movies.filter(func(m : Movie) : Bool { m.isTrending }).toArray();
  };

  /// Get top-rated movies
  public func getTopRated(movies : List.List<Movie>) : [Movie] {
    movies.filter(func(m : Movie) : Bool { m.isTopRated }).toArray();
  };

  /// Get free (non-premium) movies
  public func getFree(movies : List.List<Movie>) : [Movie] {
    movies.filter(func(m : Movie) : Bool { not m.isPremium }).toArray();
  };

  /// Get premium movies
  public func getPremium(movies : List.List<Movie>) : [Movie] {
    movies.filter(func(m : Movie) : Bool { m.isPremium }).toArray();
  };

  /// Get movies by category
  public func getByCategory(movies : List.List<Movie>, category : Text) : [Movie] {
    let lc = category.toLower();
    movies.filter(func(m : Movie) : Bool { m.category.toLower() == lc }).toArray();
  };

  /// Search movies by title/category (case-insensitive)
  public func search(movies : List.List<Movie>, searchTerm : Text) : [Movie] {
    let lc = searchTerm.toLower();
    movies.filter(func(m : Movie) : Bool {
      m.title.toLower().contains(#text lc) or m.category.toLower().contains(#text lc)
    }).toArray();
  };

  /// Add a new movie, auto-incrementing nextId
  public func add(movies : List.List<Movie>, nextId : Nat, input : MovieInput) : (Movie, Nat) {
    let now = Time.now();
    let movie : Movie = {
      id = nextId;
      title = input.title;
      description = input.description;
      category = input.category;
      thumbnailUrl = input.thumbnailUrl;
      videoUrl = input.videoUrl;
      duration = input.duration;
      rating = input.rating;
      cast = input.cast;
      isPremium = input.isPremium;
      isTrending = input.isTrending;
      isTopRated = input.isTopRated;
      createdAt = now;
    };
    movies.add(movie);
    (movie, nextId + 1);
  };

  /// Update an existing movie
  public func update(movies : List.List<Movie>, id : Nat, input : MovieInput) : ?Movie {
    var updated : ?Movie = null;
    movies.mapInPlace(func(m : Movie) : Movie {
      if (m.id == id) {
        let newMovie : Movie = {
          m with
          title = input.title;
          description = input.description;
          category = input.category;
          thumbnailUrl = input.thumbnailUrl;
          videoUrl = input.videoUrl;
          duration = input.duration;
          rating = input.rating;
          cast = input.cast;
          isPremium = input.isPremium;
          isTrending = input.isTrending;
          isTopRated = input.isTopRated;
        };
        updated := ?newMovie;
        newMovie;
      } else {
        m;
      };
    });
    updated;
  };

  /// Delete a movie by id, returns true if found and removed
  public func delete(movies : List.List<Movie>, id : Nat) : Bool {
    let sizeBefore = movies.size();
    let filtered = movies.filter(func(m : Movie) : Bool { m.id != id });
    movies.clear();
    movies.append(filtered);
    movies.size() < sizeBefore;
  };
};
