module {
  public type SubscriptionPlan = {
    id : Text;
    name : Text;
    price : Nat;
    durationMonths : Nat;
    features : [Text];
  };

  public type Subscription = {
    userId : Text;
    planId : Text;
    startedAt : Int;
    expiresAt : Int;
    isActive : Bool;
  };
};
