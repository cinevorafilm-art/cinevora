import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import UserLib "../lib/users";
import UserTypes "../types/users";

mixin (
  accessControlState : AccessControl.AccessControlState,
  users : Map.Map<Text, UserLib.UserState>,
) {
  public query func getUserProfile(userId : Text) : async ?UserTypes.UserProfile {
    UserLib.getProfile(users, userId);
  };

  public shared (_) func createOrUpdateUserProfile(
    userId : Text,
    name : Text,
    email : Text,
  ) : async UserTypes.UserProfile {
    UserLib.createOrUpdate(users, userId, name, email);
  };

  public query func getMyList(userId : Text) : async [Nat] {
    UserLib.getMyList(users, userId);
  };

  public shared (_) func addToMyList(userId : Text, movieId : Nat) : async Bool {
    UserLib.addToMyList(users, userId, movieId);
  };

  public shared (_) func removeFromMyList(userId : Text, movieId : Nat) : async Bool {
    UserLib.removeFromMyList(users, userId, movieId);
  };

  public query func getWatchHistory(userId : Text) : async [UserTypes.WatchEntry] {
    UserLib.getWatchHistory(users, userId);
  };

  public shared (_) func updateWatchProgress(
    userId : Text,
    movieId : Nat,
    progressSeconds : Nat,
  ) : async Bool {
    UserLib.updateWatchProgress(users, userId, movieId, progressSeconds);
  };
};
