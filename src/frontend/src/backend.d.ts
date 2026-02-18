import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Lead {
    name: string;
    email: string;
    message: string;
}
export interface AIInsight {
    value: number;
    explanation: string;
    relevanceScore: number;
    timeHorizon: string;
    confidence: number;
    signalType: string;
    impactPotential: string;
}
export interface InvestmentPlan {
    planId: string;
    name: string;
    minimumInvestmentRange: string;
    description: string;
    weeklyReturn: number;
    riskLevel: string;
    aiNarrative: string;
}
export interface UserProfile {
    name: string;
    email: string;
    investmentPreference: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    creditUserWallet(user: Principal, amount: number): Promise<void>;
    getAIInsights(): Promise<Array<AIInsight>>;
    getCallerNumber(): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCallerWalletBalance(): Promise<number | null>;
    getCallerWeeklyReturn(): Promise<number | null>;
    getInvestmentPlans(): Promise<Array<InvestmentPlan>>;
    getLeads(): Promise<Array<Lead>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserWalletBalance(user: Principal): Promise<number | null>;
    getUserWeeklyReturn(user: Principal): Promise<number | null>;
    initializeCallerWallet(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    purchaseInvestmentPlan(planId: string, investmentAmount: number): Promise<void>;
    registerUser(number: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitLead(name: string, email: string, message: string): Promise<void>;
}
