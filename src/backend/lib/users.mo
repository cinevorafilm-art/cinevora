import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Types "../types/users";

module {
  public type WatchEntry = Types.WatchEntry;
  public type UserProfile = Types.UserProfile;

  // Internal mutable state per user (stored in a Map keyed by userId Text)
  public type UserState = {
    userId : Text;
    var name : Text;
    var email : Text;
    var isPremium : Bool;
    var subscriptionExpiry : ?Int;
    myList : List.List<Nat>;
    watchHistory : List.List<WatchEntry>;
    createdAt : Int;
  };

  /// Project internal state to public shared type
  public func toPublic(u : UserState) : UserProfile {
    {
      userId = u.userId;
      name = u.name;
      email = u.email;
      isPremium = u.isPremium;
      subscriptionExpiry = u.subscriptionExpiry;
      myList = u.myList.toArray();
      watchHistory = u.watchHistory.toArray();
      createdAt = u.createdAt;
    };
  };

  /// Get user profile by userId
  public func getProfile(
    users : Map.Map<Text, UserState>,
    userId : Text,
  ) : ?UserProfile {
    switch (users.get(userId)) {
      case (?u) { ?toPublic(u) };
      case null { null };
    };
  };

  /// Create or update user profile, returning the updated profile
  public func createOrUpdate(
    users : Map.Map<Text, UserState>,
    userId : Text,
    name : Text,
    email : Text,
  ) : UserProfile {
    switch (users.get(userId)) {
      case (?u) {
        u.name := name;
        u.email := email;
        toPublic(u);
      };
      case null {
        let newUser : UserState = {
          userId;
          var name = name;
          var email = email;
          var isPremium = false;
          var subscriptionExpiry = null;
          myList = List.empty<Nat>();
          watchHistory = List.empty<WatchEntry>();
          createdAt = Time.now();
        };
        users.add(userId, newUser);
        toPublic(newUser);
      };
    };
  };

  /// Get My List for a user (movie IDs)
  public func getMyList(
    users : Map.Map<Text, UserState>,
    userId : Text,
  ) : [Nat] {
    switch (users.get(userId)) {
      case (?u) { u.myList.toArray() };
      case null { [] };
    };
  };

  /// Add a movie to user's list; returns false if already present
  public func addToMyList(
    users : Map.Map<Text, UserState>,
    userId : Text,
    movieId : Nat,
  ) : Bool {
    switch (users.get(userId)) {
      case (?u) {
        if (u.myList.contains(movieId)) {
          false;
        } else {
          u.myList.add(movieId);
          true;
        };
      };
      case null { false };
    };
  };

  /// Remove a movie from user's list; returns false if not found
  public func removeFromMyList(
    users : Map.Map<Text, UserState>,
    userId : Text,
    movieId : Nat,
  ) : Bool {
    switch (users.get(userId)) {
      case (?u) {
        let sizeBefore = u.myList.size();
        let filtered = u.myList.filter(func(id : Nat) : Bool { id != movieId });
        u.myList.clear();
        u.myList.append(filtered);
        u.myList.size() < sizeBefore;
      };
      case null { false };
    };
  };

  /// Get full watch history for a user
  public func getWatchHistory(
    users : Map.Map<Text, UserState>,
    userId : Text,
  ) : [WatchEntry] {
    switch (users.get(userId)) {
      case (?u) { u.watchHistory.toArray() };
      case null { [] };
    };
  };

  /// Update or add a watch progress entry
  public func updateWatchProgress(
    users : Map.Map<Text, UserState>,
    userId : Text,
    movieId : Nat,
    progressSeconds : Nat,
  ) : Bool {
    switch (users.get(userId)) {
      case (?u) {
        let now = Time.now();
        var found = false;
        u.watchHistory.mapInPlace(func(entry : WatchEntry) : WatchEntry {
          if (entry.movieId == movieId) {
            found := true;
            { entry with progressSeconds = progressSeconds; lastWatched = now };
          } else {
            entry;
          };
        });
        if (not found) {
          u.watchHistory.add({ movieId; progressSeconds; lastWatched = now });
        };
        true;
      };
      case null { false };
    };
  };

  /// Mark a user as premium with an expiry timestamp
  public func setPremium(
    users : Map.Map<Text, UserState>,
    userId : Text,
    expiresAt : Int,
  ) : () {
    switch (users.get(userId)) {
      case (?u) {
        u.isPremium := true;
        u.subscriptionExpiry := ?expiresAt;
      };
      case null { };
    };
  };

  /// Remove premium status
  public func removePremium(
    users : Map.Map<Text, UserState>,
    userId : Text,
  ) : () {
    switch (users.get(userId)) {
      case (?u) {
        u.isPremium := false;
        u.subscriptionExpiry := null;
      };
      case null { };
    };
  };
};
