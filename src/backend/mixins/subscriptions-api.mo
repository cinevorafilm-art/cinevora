import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import SubLib "../lib/subscriptions";
import SubTypes "../types/subscriptions";
import UserLib "../lib/users";

mixin (
  accessControlState : AccessControl.AccessControlState,
  subscriptions : Map.Map<Text, SubLib.Subscription>,
  users : Map.Map<Text, UserLib.UserState>,
) {
  public query func getSubscriptionPlans() : async [SubTypes.SubscriptionPlan] {
    SubLib.getPlans();
  };

  public query func getUserSubscription(userId : Text) : async ?SubTypes.Subscription {
    SubLib.getUserSubscription(subscriptions, userId);
  };

  public shared (_) func subscribe(userId : Text, planId : Text) : async SubTypes.Subscription {
    let sub = SubLib.subscribe(subscriptions, userId, planId);
    UserLib.setPremium(users, userId, sub.expiresAt);
    sub;
  };

  public shared (_) func cancelSubscription(userId : Text) : async Bool {
    let cancelled = SubLib.cancel(subscriptions, userId);
    if (cancelled) {
      UserLib.removePremium(users, userId);
    };
    cancelled;
  };
};
