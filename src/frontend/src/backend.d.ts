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
    minimumInvestment: bigint;
    name: string;
    description: string;
    monthlyReturn: number;
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
    getAIInsights(): Promise<Array<AIInsight>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInvestmentPlans(): Promise<Array<InvestmentPlan>>;
    getLeads(): Promise<Array<Lead>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitLead(name: string, email: string, message: string): Promise<void>;
}
