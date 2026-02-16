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


// Explicitly specify migration function via with-clause

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

  // Investment Plans with Trends
  let investmentPlans = Map.empty<Text, InvestmentPlan>();

  // Add three default investment plans with AI narratives and updated pricing range
  let initialPlans = [] : [InvestmentPlan];

  // Add three default investment plans with AI narratives
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
  ];

  newPlans.forEach(
    func(plan) { investmentPlans.add(plan.planId, plan) }
  );

  // AI Insights Data
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

  // Lead Storage
  let leads = Map.empty<Text, Lead>();

  // User Profiles Storage
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Get all investment plans (public access for marketing site)
  public query ({ caller }) func getInvestmentPlans() : async [InvestmentPlan] {
    investmentPlans.values().toArray().sort();
  };

  // Get all AI insights sorted by relevance score (public access for marketing site)
  public query ({ caller }) func getAIInsights() : async [AIInsight] {
    aiInsights.values().toArray().sort(AIInsight.compareByRelevanceScore);
  };

  // Add lead capture form submission functionality (public access - guests can submit)
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

  // Get all leads (restricted to admins)
  public query ({ caller }) func getLeads() : async [Lead] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view leads");
    };

    leads.values().toArray().sort(Lead.compareByEmail);
  };

  // Get caller's own user profile (users only)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  // Get another user's profile (admin can view any, users can only view their own)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Save caller's user profile (users only)
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};

