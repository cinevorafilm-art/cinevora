import List "mo:core/List";
import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import MovieLib "lib/movies";
import UserLib "lib/users";
import SubLib "lib/subscriptions";
import MoviesMixin "mixins/movies-api";
import UsersMixin "mixins/users-api";
import SubscriptionsMixin "mixins/subscriptions-api";

actor {
  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Object storage infrastructure
  include MixinObjectStorage();

  // Movies state
  let movies = MovieLib.initMovies();
  var nextMovieId : Nat = 7; // seeded movies use IDs 1-6
  let movieIdRef = { var value = nextMovieId };
  include MoviesMixin(accessControlState, movies, movieIdRef);

  // Users state
  let users = Map.empty<Text, UserLib.UserState>();
  include UsersMixin(accessControlState, users);

  // Subscriptions state
  let subscriptions = Map.empty<Text, SubLib.Subscription>();
  include SubscriptionsMixin(accessControlState, subscriptions, users);
};
