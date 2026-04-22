module {
  public type WatchEntry = {
    movieId : Nat;
    progressSeconds : Nat;
    lastWatched : Int;
  };

  public type UserProfile = {
    userId : Text;
    name : Text;
    email : Text;
    isPremium : Bool;
    subscriptionExpiry : ?Int;
    myList : [Nat];
    watchHistory : [WatchEntry];
    createdAt : Int;
  };


};
