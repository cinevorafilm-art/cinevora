import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import MovieLib "../lib/movies";
import MovieTypes "../types/movies";

mixin (
  accessControlState : AccessControl.AccessControlState,
  movies : List.List<MovieLib.Movie>,
  nextMovieId : { var value : Nat },
) {
  public query func getMovies() : async [MovieTypes.Movie] {
    MovieLib.getAll(movies);
  };

  public query func getMovie(id : Nat) : async ?MovieTypes.Movie {
    MovieLib.getById(movies, id);
  };

  public query func getTrendingMovies() : async [MovieTypes.Movie] {
    MovieLib.getTrending(movies);
  };

  public query func getTopRatedMovies() : async [MovieTypes.Movie] {
    MovieLib.getTopRated(movies);
  };

  public query func getFreeMovies() : async [MovieTypes.Movie] {
    MovieLib.getFree(movies);
  };

  public query func getPremiumMovies() : async [MovieTypes.Movie] {
    MovieLib.getPremium(movies);
  };

  public query func getMoviesByCategory(category : Text) : async [MovieTypes.Movie] {
    MovieLib.getByCategory(movies, category);
  };

  public query func searchMovies(searchTerm : Text) : async [MovieTypes.Movie] {
    MovieLib.search(movies, searchTerm);
  };

  public shared ({ caller }) func addMovie(input : MovieTypes.MovieInput) : async MovieTypes.Movie {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin only");
    };
    let (movie, newId) = MovieLib.add(movies, nextMovieId.value, input);
    nextMovieId.value := newId;
    movie;
  };

  public shared ({ caller }) func updateMovie(id : Nat, input : MovieTypes.MovieInput) : async ?MovieTypes.Movie {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin only");
    };
    MovieLib.update(movies, id, input);
  };

  public shared ({ caller }) func deleteMovie(id : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin only");
    };
    MovieLib.delete(movies, id);
  };
};
