import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
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
export interface TelegramBotConfig {
    active: boolean;
    chatId: string;
    botToken: string;
}
export interface DepositRequest {
    principal: Principal;
    userId: string;
    userProfile?: UserProfile;
    screenshot: ExternalBlob;
}
export interface DepositEligibility {
    requiresNumber: boolean;
    requiresProfile: boolean;
    isEligible: boolean;
    requiresAuthentication: boolean;
    message: string;
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
    adminCreditSpecificUser(): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkDepositEligibility(): Promise<DepositEligibility>;
    creditUserWallet(user: Principal, amount: number): Promise<void>;
    getAIInsights(): Promise<Array<AIInsight>>;
    getCallerNumber(): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCallerWalletBalance(): Promise<number | null>;
    getCallerWeeklyReturn(): Promise<number | null>;
    getDepositRequestsTest(): Promise<Array<DepositRequest>>;
    getInvestmentPlans(): Promise<Array<InvestmentPlan>>;
    getLeads(): Promise<Array<Lead>>;
    getTelegramBotConfig(): Promise<TelegramBotConfig>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserWalletBalance(user: Principal): Promise<number | null>;
    getUserWeeklyReturn(user: Principal): Promise<number | null>;
    initializeCallerWallet(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    purchaseInvestmentPlan(planId: string, investmentAmount: number): Promise<void>;
    registerAuthenticatedUser(): Promise<void>;
    registerUser(number: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setWalletBalance(user: Principal, balance: number): Promise<void>;
    setWalletBalanceByEmail(email: string, balance: number): Promise<void>;
    submitDeposit(screenshot: ExternalBlob): Promise<string>;
    submitLead(name: string, email: string, message: string): Promise<void>;
    updateTelegramBotConfig(botToken: string, chatId: string, active: boolean): Promise<void>;
}
