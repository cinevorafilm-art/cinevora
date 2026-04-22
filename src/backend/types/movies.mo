module {
  public type Movie = {
    id : Nat;
    title : Text;
    description : Text;
    category : Text;
    thumbnailUrl : Text;
    videoUrl : Text;
    duration : Text;
    rating : Float;
    cast : [Text];
    isPremium : Bool;
    isTrending : Bool;
    isTopRated : Bool;
    createdAt : Int;
  };

  public type MovieInput = {
    title : Text;
    description : Text;
    category : Text;
    thumbnailUrl : Text;
    videoUrl : Text;
    duration : Text;
    rating : Float;
    cast : [Text];
    isPremium : Bool;
    isTrending : Bool;
    isTopRated : Bool;
  };
};
