const en = {
  nav: {
    home: "Home",
    lou: "Lou",
    rituals: "Rituals",
    market: "Market",
    profile: "Profile",
    sommeliers: "Sommeliers",
  },
  welcome: {
    brand: "Maison Théorea",
    beginJourney: "Begin your tea journey",
    welcomeBack: "Welcome back",
    createAccountSub: "Create your account to meet Lou, your personal tea sommelier.",
    signInSub: "Sign in to continue your ritual.",
    signUpGoogle: "Sign up with Google",
    signInGoogle: "Sign in with Google",
    connecting: "Connecting...",
    or: "or",
    yourName: "Your name",
    emailAddress: "Email address",
    sending: "Sending...",
    createAccount: "Create account",
    sendSignInLink: "Send sign-in link",
    checkEmailSignup: "Check your email for a verification link.",
    checkEmailLogin: "Check your email for your sign-in link.",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign in",
    newToTheorea: "New to Théorea?",
    browseAsGuest: "Browse as guest",
    legal: "By continuing, you agree to our Terms of Service and Privacy Policy.",
    password: "Password",
    confirmPassword: "Confirm password",
    newPassword: "New password",
    forgotPassword: "Forgot password?",
    resetPassword: "Reset your password",
    resetPasswordSub: "Enter your email and we'll send you a link to reset your password.",
    sendResetLink: "Send reset link",
    checkEmailReset: "Check your email for a password reset link.",
    chooseNewPassword: "Choose a new password",
    chooseNewPasswordSub: "At least 8 characters. You'll be signed in automatically.",
    updatePassword: "Update password",
    passwordUpdated: "Password updated. Signing you in...",
    passwordTooShort: "Password must be at least 8 characters.",
    passwordMismatch: "Passwords do not match.",
    verifyingLink: "Verifying your link...",
    backToSignIn: "Back to sign in",
    marketingConsent: "Keep me informed about new teas, rituals and Théorea stories.",
  },
  dashboard: {
    louSuggests: "Lou suggests",
    startSession: "Start a session",
    logRitual: "Log Ritual",
    recordSession: "Record a session",
    browseTeas: "Browse Teas",
    exploreCollection: "Explore the collection",
    recent: "Recent",
    seeAll: "See all",
    marketplace: "Marketplace",
    browse: "Browse",
    today: "Today",
    yesterday: "Yesterday",
    focused: "Focused",
    calm: "Calm",
    present: "Present",
  },
  lou: {
    whatExplore: "What shall we explore?",
    subtitle: "Tea varieties, brewing techniques, flavour profiles, or a mindful ritual.",
    askPlaceholder: "Ask Lou anything...",
    errorFallback: "Something went wrong",
    chips: [
      "How do I brew Da Hong Pao?",
      "What tea suits this evening?",
      "Compare your two teas",
      "Guide me through a ritual",
    ],
    signInRequired: "Sign in to chat with Lou",
    signInRequiredSub: "Create a free account to begin your tea journey.",
    signInButton: "Sign in",
    limitReached: "You've reached your monthly limit",
    limitReachedSub: "Free members enjoy 10 conversations with Lou each month.",
    becomeMember: "Become a Théorea Member",
    memberPitch: "Unlimited access to Lou for £4.99 / month",
    messagesRemaining: (n: number) => n === 1 ? "1 message remaining this month" : `${n} messages remaining this month`,
  },
  marketplace: {
    title: "Marketplace",
    subtitle: "Curated with intention",
    searchPlaceholder: "Search teas, origins, flavours...",
    available: "Available",
    comingSoon: "Coming soon",
    notifyMe: "Notify me",
    theorea: "Théorea",
    oolong: "Oolong",
    greenTea: "Green Tea",
    greenTeaScented: "Green Tea, Scented",
    puerh: "Pu-erh",
    whiteTea: "White Tea",
  },
  rituals: {
    title: "Rituals",
    log: "Log",
    focused: "Focused",
    calm: "Calm",
    present: "Present",
  },
  profile: {
    guest: "Tea Enthusiast",
    rituals: "Rituals",
    teas: "Teas",
    days: "Days",
    teaPreferences: "Tea Preferences",
    preferredTypes: "Preferred types",
    flavourProfile: "Flavour profile",
    ritualStyle: "Ritual style",
    account: "Account",
    notifications: "Notifications",
    privacy: "Privacy",
    helpSupport: "Help & Support",
    language: "Language",
    signOut: "Sign Out",
  },
  sommeliers: {
    title: "Sommeliers",
    communityBrewing: "The community is brewing",
    description: "Tea sommeliers and experts will share tasting notes, curate collections, and guide your palate.",
    notifyMe: "Notify me",
  },
};

export default en;

export interface Messages {
  nav: {
    home: string;
    lou: string;
    rituals: string;
    market: string;
    profile: string;
    sommeliers: string;
  };
  welcome: {
    brand: string;
    beginJourney: string;
    welcomeBack: string;
    createAccountSub: string;
    signInSub: string;
    signUpGoogle: string;
    signInGoogle: string;
    connecting: string;
    or: string;
    yourName: string;
    emailAddress: string;
    sending: string;
    createAccount: string;
    sendSignInLink: string;
    checkEmailSignup: string;
    checkEmailLogin: string;
    alreadyHaveAccount: string;
    signIn: string;
    newToTheorea: string;
    browseAsGuest: string;
    legal: string;
    password: string;
    confirmPassword: string;
    newPassword: string;
    forgotPassword: string;
    resetPassword: string;
    resetPasswordSub: string;
    sendResetLink: string;
    checkEmailReset: string;
    chooseNewPassword: string;
    chooseNewPasswordSub: string;
    updatePassword: string;
    passwordUpdated: string;
    passwordTooShort: string;
    passwordMismatch: string;
    verifyingLink: string;
    backToSignIn: string;
    marketingConsent: string;
  };
  dashboard: {
    louSuggests: string;
    startSession: string;
    logRitual: string;
    recordSession: string;
    browseTeas: string;
    exploreCollection: string;
    recent: string;
    seeAll: string;
    marketplace: string;
    browse: string;
    today: string;
    yesterday: string;
    focused: string;
    calm: string;
    present: string;
  };
  lou: {
    whatExplore: string;
    subtitle: string;
    askPlaceholder: string;
    errorFallback: string;
    chips: string[];
    signInRequired: string;
    signInRequiredSub: string;
    signInButton: string;
    limitReached: string;
    limitReachedSub: string;
    becomeMember: string;
    memberPitch: string;
    messagesRemaining: (n: number) => string;
  };
  marketplace: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    available: string;
    comingSoon: string;
    notifyMe: string;
    theorea: string;
    oolong: string;
    greenTea: string;
    greenTeaScented: string;
    puerh: string;
    whiteTea: string;
  };
  rituals: {
    title: string;
    log: string;
    focused: string;
    calm: string;
    present: string;
  };
  profile: {
    guest: string;
    rituals: string;
    teas: string;
    days: string;
    teaPreferences: string;
    preferredTypes: string;
    flavourProfile: string;
    ritualStyle: string;
    account: string;
    notifications: string;
    privacy: string;
    helpSupport: string;
    language: string;
    signOut: string;
  };
  sommeliers: {
    title: string;
    communityBrewing: string;
    description: string;
    notifyMe: string;
  };
}
