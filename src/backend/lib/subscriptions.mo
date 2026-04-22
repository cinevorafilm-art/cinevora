import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/subscriptions";

module {
  public type SubscriptionPlan = Types.SubscriptionPlan;
  public type Subscription = Types.Subscription;

  let plans : [SubscriptionPlan] = [
    {
      id = "monthly";
      name = "Monthly Premium";
      price = 9900;
      durationMonths = 1;
      features = ["HD Streaming", "No Ads", "Access to Premium Content", "Watch Anywhere"];
    },
    {
      id = "quarterly";
      name = "Quarterly Premium";
      price = 19900;
      durationMonths = 3;
      features = ["HD Streaming", "No Ads", "Access to Premium Content", "Watch Anywhere", "25% Savings"];
    },
  ];

  /// Return the static list of available subscription plans
  public func getPlans() : [SubscriptionPlan] {
    plans;
  };

  /// Get active subscription for a user
  public func getUserSubscription(
    subscriptions : Map.Map<Text, Subscription>,
    userId : Text,
  ) : ?Subscription {
    subscriptions.get(userId);
  };

  /// Subscribe a user to a plan; returns the new Subscription record
  public func subscribe(
    subscriptions : Map.Map<Text, Subscription>,
    userId : Text,
    planId : Text,
  ) : Subscription {
    let now = Time.now();
    // find plan duration
    var durationMonths : Nat = 1;
    for (plan in plans.values()) {
      if (plan.id == planId) {
        durationMonths := plan.durationMonths;
      };
    };
    // nanoseconds per month (30 days)
    let monthNs : Int = 30 * 24 * 60 * 60 * 1_000_000_000;
    let expiresAt : Int = now + (durationMonths.toInt() * monthNs);
    let sub : Subscription = {
      userId;
      planId;
      startedAt = now;
      expiresAt;
      isActive = true;
    };
    subscriptions.add(userId, sub);
    sub;
  };

  /// Cancel a subscription; returns false if user had no subscription
  public func cancel(
    subscriptions : Map.Map<Text, Subscription>,
    userId : Text,
  ) : Bool {
    switch (subscriptions.get(userId)) {
      case (?_) {
        subscriptions.remove(userId);
        true;
      };
      case null { false };
    };
  };
};
