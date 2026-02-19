import Map "mo:core/Map";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Storage "blob-storage/Storage";

import MixinStorage "blob-storage/Mixin";
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

  type AIInsight = {
    signalType : Text;
    value : Float;
    confidence : Float;
    explanation : Text;
    relevanceScore : Float;
    timeHorizon : Text;
    impactPotential : Text;
  };

  type Lead = {
    name : Text;
    email : Text;
    message : Text;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    investmentPreference : Text;
  };

  type DepositRequest = {
    userProfile : ?UserProfile;
    userId : Text;
    screenshot : Storage.ExternalBlob;
    principal : Principal;
  };

  module DepositRequest {
    public func compare(request1 : DepositRequest, request2 : DepositRequest) : Order.Order {
      Text.compare(request1.userId, request2.userId);
    };
  };

  type DepositEligibility = {
    isEligible : Bool;
    requiresAuthentication : Bool;
    requiresNumber : Bool;
    requiresProfile : Bool;
    message : Text;
  };

  type UserWallet = {
    balance : Float;
    weeklyReturn : Float;
  };

  type TelegramBotConfig = {
    botToken : Text;
    chatId : Text;
    active : Bool;
  };

  module TelegramBotConfig {
    public func compare(config1 : TelegramBotConfig, config2 : TelegramBotConfig) : Order.Order {
      Text.compare(config1.botToken, config2.botToken);
    };

    public func default() : TelegramBotConfig {
      {
        botToken = "";
        chatId = "";
        active = false;
      };
    };
  };

  module InvestmentPlan {
    public func compare(plan1 : InvestmentPlan, plan2 : InvestmentPlan) : Order.Order {
      Text.compare(plan1.planId, plan2.planId);
    };
  };

  module AIInsight {
    public func compareByRelevanceScore(insight1 : AIInsight, insight2 : AIInsight) : Order.Order {
      Float.compare(insight1.relevanceScore, insight2.relevanceScore);
    };
  };

  module Lead {
    public func compareByEmail(lead1 : Lead, lead2 : Lead) : Order.Order {
      Text.compare(lead1.email, lead2.email);
    };
  };

  let userWallets = Map.empty<Principal, UserWallet>();
  let investmentPlans = Map.empty<Text, InvestmentPlan>();
  let aiInsights = Map.empty<Text, AIInsight>();
  let leads = Map.empty<Text, Lead>();
  var depositRequests = Map.empty<Principal, DepositRequest>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userUniqueNumbers = Map.empty<Principal, Nat>();
  let telegramBotConfigs = Map.empty<Text, TelegramBotConfig>();

  telegramBotConfigs.add("default", TelegramBotConfig.default());

  let accessControlState = AccessControl.initState();
  include MixinStorage();
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
    let completeProfile = switch (userProfiles.get(caller)) {
      case (?existingProfile) {
        {
          name = if (profile.name != "") { profile.name } else { existingProfile.name };
          email = if (profile.email != "") { profile.email } else { existingProfile.email };
          investmentPreference = if (profile.investmentPreference != "") { profile.investmentPreference } else {
            existingProfile.investmentPreference;
          };
        };
      };
      case (null) {
        {
          name = profile.name;
          email = profile.email;
          investmentPreference = profile.investmentPreference;
        };
      };
    };
    userProfiles.add(caller, completeProfile);
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

  public shared ({ caller }) func adminCreditSpecificUser() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let userPrincipal = Principal.fromText("mzmds-idwio-g2zsr-4dzef-bqy4l-hkopr-jkddk-spzk4-utlyx-oqjxf-kae");
    await creditUserWallet(userPrincipal, 20.0);
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

  // Admin-only function to set a user's wallet balance based on their email address
  public shared ({ caller }) func setWalletBalanceByEmail(email : Text, balance : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set wallet balances");
    };

    if (email.isEmpty()) {
      Runtime.trap("Invalid input: Email cannot be empty");
    };

    if (balance < 0.0) {
      Runtime.trap("Balance cannot be negative");
    };

    // Find the user profile with the matching email
    let matchedUser = userProfiles.toArray().find(
      func((_, profile)) { profile.email.trim(#predicate(func(c) { c == ' ' })).toLower() == email.trim(#predicate(func(c) { c == ' ' })).toLower() }
    );

    let userPrincipal = switch (matchedUser) {
      case (?match) { match.0 };
      case (null) { Runtime.trap("No user found with email " # email) };
    };

    let currentWallet = switch (userWallets.get(userPrincipal)) {
      case (?w) { w };
      case (null) { { balance = 0.0; weeklyReturn = 0.0 } };
    };

    let newWallet = {
      balance;
      weeklyReturn = currentWallet.weeklyReturn;
    };

    userWallets.add(userPrincipal, newWallet);
  };

  // Admin-only function to set (replace) a user wallet balance by Principal
  public shared ({ caller }) func setWalletBalance(user : Principal, balance : Float) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can set wallet balances");
    };

    if (balance < 0.0) {
      Runtime.trap("Balance cannot be negative");
    };

    let currentWallet = switch (userWallets.get(user)) {
      case (?w) { w };
      case (null) {
        {
          balance = 0.0;
          weeklyReturn = 0.0;
        };
      };
    };

    let newWallet = {
      balance;
      weeklyReturn = currentWallet.weeklyReturn;
    };

    userWallets.add(user, newWallet);
  };

  //-----------------------
  // Deposit Submission API
  //-----------------------

  // Admin-only query method for viewing deposit requests
  public query ({ caller }) func getDepositRequestsTest() : async [DepositRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view deposit requests");
    };
    depositRequests.values().toArray().sort();
  };

  public query ({ caller }) func getTelegramBotConfig() : async TelegramBotConfig {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view Telegram bot configuration");
    };
    switch (telegramBotConfigs.get("default")) {
      case (?config) { config };
      case (null) { Runtime.trap("No Telegram bot configuration found") };
    };
  };

  public shared ({ caller }) func updateTelegramBotConfig(botToken : Text, chatId : Text, active : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update the Telegram bot configuration");
    };

    let newConfig = {
      botToken;
      chatId;
      active;
    };

    telegramBotConfigs.add("default", newConfig);
  };

  public query ({ caller }) func checkDepositEligibility() : async DepositEligibility {
    let eligibility = if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      {
        isEligible = false;
        requiresAuthentication = true;
        requiresNumber = false;
        requiresProfile = false;
        message = "You must be logged in to submit deposits";
      };
    } else {
      switch (userUniqueNumbers.get(caller), userProfiles.get(caller)) {
        case (null, _) {
          {
            isEligible = false;
            requiresAuthentication = false;
            requiresNumber = true;
            requiresProfile = false;
            message = "You need to register your unique number before submitting a deposit";
          };
        };
        case (_, null) {
          {
            isEligible = false;
            requiresAuthentication = false;
            requiresNumber = false;
            requiresProfile = true;
            message = "You must have a valid email in your user profile in order to submit a deposit";
          };
        };
        case (_, ?profile) {
          if (profile.email.trim(#predicate(func(c) { c == ' ' })).isEmpty()) {
            {
              isEligible = false;
              requiresAuthentication = false;
              requiresNumber = false;
              requiresProfile = true;
              message = "You must have a valid email in your user profile in order to submit a deposit";
            };
          } else {
            {
              isEligible = true;
              requiresAuthentication = false;
              requiresNumber = false;
              requiresProfile = false;
              message = "You are eligible to submit deposits";
            };
          };
        };
      };
    };
    eligibility;
  };

  public shared ({ caller }) func submitDeposit(screenshot : Storage.ExternalBlob) : async Text {
    switch (await checkDepositEligibility()) {
      case ({ isEligible = false; requiresAuthentication = true }) {
        Runtime.trap("Unauthorized. Only logged-in users can submit deposit requests");
      };
      case ({
        isEligible = false;
        requiresNumber = true;
        requiresAuthentication;
      }) { return "You need to register before submitting a deposit request" };
      case ({
        isEligible = false;
        requiresProfile = true;
        requiresAuthentication;
      }) { return "You must have a valid email in your user profile"; };
      case ({ isEligible = true }) {}; // all checks pass
    };

    func hasDepositLimitExceeded(userId : Text) : Bool {
      let depositLimit = 25;
      let userDepositCount = depositRequests.values().toArray().filter(func(request) { request.userId == userId }).size();
      userDepositCount >= depositLimit;
    };

    let userId = switch (userUniqueNumbers.get(caller)) {
      case (?number) { number.toText() };
      case (null) { Runtime.trap("The operation should not reach this branch. You must have a valid account number for deposits.") };
    };

    if (hasDepositLimitExceeded(userId)) {
      return "You have reached the maximum of 25 allowable deposits";
    };

    let depositRecord = {
      userProfile = userProfiles.get(caller);
      userId;
      screenshot;
      principal = caller;
    };

    depositRequests.add(caller, depositRecord);

    "Deposit request submitted successfully!";
  };

  //----------------------------------
  // Register Authenticated Users 
  //----------------------------------
  public shared ({ caller }) func registerAuthenticatedUser() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can be registered");
    };

    // Create missing profile entry for registered user if not yet present
    switch (userProfiles.get(caller)) {
      case (?_) { /* Already set, nothing to do*/ };
      case (null) {
        let newProfile = {
          name = "";
          email = "";
          investmentPreference = "";
        };
        userProfiles.add(caller, newProfile);
      };
    };

    // Create missing user wallet entry for registered user
    switch (userWallets.get(caller)) {
      case (?_) { /* Already set, nothing to do*/ };
      case (null) {
        let newWallet = {
          balance = 0.0;
          weeklyReturn = 0.0;
        };
        userWallets.add(caller, newWallet);
      };
    };
  };
};
