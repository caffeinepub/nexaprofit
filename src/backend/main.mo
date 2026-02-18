import Map "mo:core/Map";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type InvestmentPlan = {
    planId : Text;
    name : Text;
    description : Text;
    weeklyReturn : Float;
    riskLevel : Text;
    minimumInvestmentRange : Text;
    aiNarrative : Text;
  };

  module InvestmentPlan {
    public func compare(plan1 : InvestmentPlan, plan2 : InvestmentPlan) : Order.Order {
      Text.compare(plan1.planId, plan2.planId);
    };
  };

  type AIInsight = {
    signalType : Text;
    value : Float;
    confidence : Float;
    explanation : Text;
    relevanceScore : Float;
    timeHorizon : Text;
    impactPotential : Text;
  };

  module AIInsight {
    public func compareByRelevanceScore(insight1 : AIInsight, insight2 : AIInsight) : Order.Order {
      Float.compare(insight1.relevanceScore, insight2.relevanceScore);
    };
  };

  type Lead = {
    name : Text;
    email : Text;
    message : Text;
  };

  module Lead {
    public func compareByEmail(lead1 : Lead, lead2 : Lead) : Order.Order {
      Text.compare(lead1.email, lead2.email);
    };
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    investmentPreference : Text;
  };

  type UserWallet = {
    balance : Float;
    weeklyReturn : Float;
  };

  let userWallets = Map.empty<Principal, UserWallet>();
  let investmentPlans = Map.empty<Text, InvestmentPlan>();

  let initialPlans = [] : [InvestmentPlan];
  let newPlans : [InvestmentPlan] = [
    {
      planId = "plan1";
      name = "Balanced Growth Portfolio";
      description = "A diversified portfolio aiming for steady long-term growth.";
      weeklyReturn = 0.385;
      riskLevel = "Medium";
      minimumInvestmentRange = "$51 - $200";
      aiNarrative = "AI projection indicates a 74.2% probability of achieving above-market returns within the next 18 months, based on current trend analysis and sentiment index.";
    },
    {
      planId = "plan2";
      name = "High-Yield Equities Focus";
      description = "Focuses on high-performing equities with robust growth potential.";
      weeklyReturn = 0.49;
      riskLevel = "High";
      minimumInvestmentRange = "$201 - $1000";
      aiNarrative = "Sentiment signals suggest short-term volatility with a positive bias. Adaptive AI insights recommend sector rotation as a strategy for enhanced resilience.";
    },
    {
      planId = "plan3";
      name = "Conservative Income Plan";
      description = "A risk-mitigated plan prioritizing stable, recurring yields.";
      weeklyReturn = 0.28;
      riskLevel = "Low";
      minimumInvestmentRange = "$10 - $50";
      aiNarrative = "Trend stability indicator at 93% confirms high resilience. AI-driven scenario analysis predicts consistent negative correlation with market fluctuations.";
    },
    {
      planId = "free-plan";
      name = "Free Plan";
      description = "Experience careful investing risk-free! The Free Plan simulates market scenarios to educate investors.";
      weeklyReturn = 0.0;
      riskLevel = "None";
      minimumInvestmentRange = "Free";
      aiNarrative = "Virtual plan with no real investment or payout. Learn market trends, no risk and only -$0.35/day are simulated. Not for profit-generating.";
    },
  ];

  newPlans.forEach(
    func(plan) { investmentPlans.add(plan.planId, plan) }
  );

  let aiInsights = Map.empty<Text, AIInsight>();
  let defaultInsights = [
    {
      signalType = "Volatility Index";
      value = 32.5;
      confidence = 0.92;
      explanation = "Elevated volatility expected due to recent geopolitical events, though forecasts indicate sustained stability in defensive market segments.";
      relevanceScore = 0.87;
      timeHorizon = "Short-term";
      impactPotential = "Moderate";
    },
    {
      signalType = "Trend Strength";
      value = 0.78;
      confidence = 0.86;
      explanation = "Long-term bullish tendencies observed in emerging markets, supported by positive capital flow signals and sector rotations.";
      relevanceScore = 0.91;
      timeHorizon = "Long-term";
      impactPotential = "High";
    },
    {
      signalType = "Sentiment Index";
      value = 54.2;
      confidence = 0.97;
      explanation = "Improved investor confidence, indicated by increased sentiment index and positive market momentum signals.";
      relevanceScore = 0.81;
      timeHorizon = "Medium-term";
      impactPotential = "Medium";
    },
  ];
  let defaultInsightKeys = ["insight1", "insight2", "insight3"];
  for (i in defaultInsights.keys()) {
    let key = if (i < defaultInsightKeys.size()) { defaultInsightKeys[i] : Text } else { "" };
    aiInsights.add(key, defaultInsights[i]);
  };

  let leads = Map.empty<Text, Lead>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userUniqueNumbers = Map.empty<Principal, Nat>();

  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getInvestmentPlans() : async [InvestmentPlan] {
    investmentPlans.values().toArray().sort();
  };

  public query ({ caller }) func getAIInsights() : async [AIInsight] {
    aiInsights.values().toArray().sort(AIInsight.compareByRelevanceScore);
  };

  public shared ({ caller }) func submitLead(name : Text, email : Text, message : Text) : async () {
    if (email.isEmpty() or name.isEmpty()) {
      Runtime.trap("Invalid input");
    };

    let newLead = {
      name;
      email;
      message;
    };

    leads.add(email, newLead);
  };

  public query ({ caller }) func getLeads() : async [Lead] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view leads");
    };

    leads.values().toArray().sort(Lead.compareByEmail);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func initializeCallerWallet() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can initialize wallets");
    };

    switch (userWallets.get(caller)) {
      case (?_) { /* Wallet already exists, do nothing */ };
      case (null) {
        let newWallet = {
          balance = 0.0;
          weeklyReturn = 0.0;
        };
        userWallets.add(caller, newWallet);
      };
    };
  };

  public query ({ caller }) func getCallerWalletBalance() : async ?Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access wallet");
    };
    userWallets.get(caller).map(func(wallet) { wallet.balance });
  };

  public query ({ caller }) func getCallerWeeklyReturn() : async ?Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access wallet");
    };
    userWallets.get(caller).map(func(wallet) { wallet.weeklyReturn });
  };

  public query ({ caller }) func getUserWalletBalance(user : Principal) : async ?Float {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view other users' wallets");
    };
    userWallets.get(user).map(func(wallet) { wallet.balance });
  };

  public query ({ caller }) func getUserWeeklyReturn(user : Principal) : async ?Float {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view other users' wallets");
    };
    userWallets.get(user).map(func(wallet) { wallet.weeklyReturn });
  };

  public shared ({ caller }) func purchaseInvestmentPlan(planId : Text, investmentAmount : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can purchase plans");
    };

    if (investmentAmount <= 0.0) {
      Runtime.trap("Investment amount must be positive");
    };

    let plan = switch (investmentPlans.get(planId)) {
      case (?p) { p };
      case (null) { Runtime.trap("Plan not found") };
    };

    let currentWallet = switch (userWallets.get(caller)) {
      case (?w) { w };
      case (null) { Runtime.trap("Wallet not found. Please initialize your wallet first.") };
    };

    if (currentWallet.balance < investmentAmount) {
      Runtime.trap("Insufficient balance");
    };

    let newWallet = {
      balance = currentWallet.balance - investmentAmount;
      weeklyReturn = plan.weeklyReturn;
    };
    userWallets.add(caller, newWallet);
  };

  public shared ({ caller }) func creditUserWallet(user : Principal, amount : Float) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can credit wallets");
    };

    if (amount <= 0.0) {
      Runtime.trap("Credit amount must be positive");
    };

    let currentWallet = switch (userWallets.get(user)) {
      case (?w) { w };
      case (null) {
        let newWallet = {
          balance = amount;
          weeklyReturn = 0.0;
        };
        userWallets.add(user, newWallet);
        return;
      };
    };

    let updatedWallet = {
      balance = currentWallet.balance + amount;
      weeklyReturn = currentWallet.weeklyReturn;
    };
    userWallets.add(user, updatedWallet);
  };

  public query ({ caller }) func getCallerNumber() : async Nat {
    switch (userUniqueNumbers.get(caller)) {
      case (?number) { number };
      case (null) { Runtime.trap("User has not been assigned a number. Please register an account."); };
    };
  };

  public shared ({ caller }) func registerUser(number : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("You must be logged in to register");
    };
    if (number > 1_000_000) {
      Runtime.trap("Cannot register a number above 1_000_000");
    };
    if (number < 10_000) {
      Runtime.trap("Cannot register a number below 10_000");
    };
    if (userUniqueNumbers.values().any(func(x) { x == number })) {
      Runtime.trap("This number is already taken");
    };
    userUniqueNumbers.add(caller, number);
  };
};
