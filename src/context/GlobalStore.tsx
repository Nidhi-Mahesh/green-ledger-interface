import React, { createContext, useContext, useReducer, useEffect } from "react";

export type ProjectStatus =
  | "unverified"
  | "verifying"
  | "verified"
  | "approved-reduced"
  | "frozen"
  | "rejected"
  | "tradable";

export interface VerificationStep {
  id: string;
  name: string;
  status: "pending" | "in-progress" | "completed";
  iconName: string;
}

export interface AgentResult {
  agentName: string;
  confidenceScore: number;
  anomalyScore: number;
  estimatedVerifiedTons: number;
  weight: number;
}

export interface Project {
  id: string;
  name: string;
  type: string;
  location: string;
  claimedReduction: number;
  description: string;
  status: ProjectStatus;
  submittedDate: string;
  attestationHash: string | null;
  mintTxHash: string | null;
  evidenceHash: string | null;
  verificationSteps: VerificationStep[];
  agentResults: AgentResult[] | null;
  consensusData: {
    weightedConfidence: number;
    maxAnomaly: number;
    finalVerifiedTons: number;
    reductionReason?: string;
  } | null;
  availableSupply: number;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  projectId: string;
  projectName: string;
  attestationHash: string | null;
  actionType: "submission" | "verification" | "minting" | "trade" | "retirement";
  details: string;
}

export type UserRole = "project-owner" | "verifier" | "buyer-seller";

export interface GlobalState {
  projects: Project[];
  auditLog: AuditEvent[];
  userRole: UserRole;
  portfolio: {
    creditsOwned: number;
    collateralRequirement: number;
  };
}

type Action =
  | { type: "ADD_PROJECT"; payload: Project }
  | { type: "UPDATE_PROJECT"; payload: Project }
  | { type: "SET_USER_ROLE"; payload: UserRole }
  | { type: "ADD_AUDIT_EVENT"; payload: AuditEvent }
  | { type: "BUY_CREDITS"; payload: { projectId: string; amount: number } }
  | { type: "RETIRE_CREDITS"; payload: { amount: number } }
  | { type: "RESET_STATE" };

const initialState: GlobalState = {
  projects: [
    {
      id: "proj-sample-001",
      name: "Rainforest Conservation - Amazon Delta",
      type: "Reforestation",
      location: "Brazil",
      claimedReduction: 100,
      description: "Priority reforestation project in the Amazon Delta targeting 100 tons of sequestered carbon over 5 years. This project uses IoT soil sensors and satellite imagery for baseline verification.",
      status: "tradable",
      submittedDate: "2024-01-10",
      attestationHash: "0x7d8e9f2a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
      mintTxHash: "0x4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f",
      evidenceHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      verificationSteps: [
        { id: "submitted", name: "Submitted", status: "completed", iconName: "FileText" },
        { id: "baseline", name: "Baseline Agent Analysis", status: "completed", iconName: "Bot" },
        { id: "satellite", name: "Satellite Agent Analysis", status: "completed", iconName: "Satellite" },
        { id: "anomaly", name: "Anomaly Agent Analysis", status: "completed", iconName: "AlertTriangle" },
        { id: "consensus", name: "Consensus Calculation", status: "completed", iconName: "Calculator" },
        { id: "result", name: "Final Result", status: "completed", iconName: "Shield" },
      ],
      agentResults: [
        { agentName: "Satellite Analysis", confidenceScore: 92.4, anomalyScore: 4.2, estimatedVerifiedTons: 98, weight: 0.4 },
        { agentName: "Baseline Auditor", confidenceScore: 88.5, anomalyScore: 5.1, estimatedVerifiedTons: 100, weight: 0.35 },
        { agentName: "Anomaly Detector", confidenceScore: 95.0, anomalyScore: 2.3, estimatedVerifiedTons: 99, weight: 0.25 },
      ],
      consensusData: {
        weightedConfidence: 91.7,
        finalVerifiedTons: 99,
        maxAnomaly: 5.1,
      },
      availableSupply: 99,
    }
  ],
  auditLog: [
    {
      id: "evt-initial-001",
      timestamp: "2024-01-15T10:30:00Z",
      projectId: "proj-sample-001",
      projectName: "Rainforest Conservation - Amazon Delta",
      attestationHash: "0x7d8e9f2a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
      actionType: "verification",
      details: "Multi-agent consensus achieved. Project verified with 91.7% confidence. 99 tons minted to ledger.",
    }
  ],
  userRole: "project-owner",
  portfolio: {
    creditsOwned: 0,
    collateralRequirement: 0,
  },
};

const globalReducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case "ADD_PROJECT":
      return {
        ...state,
        projects: [action.payload, ...state.projects],
      };
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case "SET_USER_ROLE":
      return {
        ...state,
        userRole: action.payload,
      };
    case "ADD_AUDIT_EVENT":
      return {
        ...state,
        auditLog: [action.payload, ...state.auditLog],
      };
    case "BUY_CREDITS": {
      const project = state.projects.find((p) => p.id === action.payload.projectId);
      if (!project) return state;

      const newAvailableSupply = Math.max(0, project.availableSupply - action.payload.amount);

      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.projectId
            ? { ...p, availableSupply: newAvailableSupply }
            : p
        ),
        portfolio: {
          ...state.portfolio,
          creditsOwned: state.portfolio.creditsOwned + action.payload.amount,
        },
      };
    }
    case "RETIRE_CREDITS":
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          creditsOwned: Math.max(0, state.portfolio.creditsOwned - action.payload.amount),
        },
      };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
};

const GlobalContext = createContext<{
  state: GlobalState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export const GlobalStoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(globalReducer, initialState, (initial) => {
    const saved = localStorage.getItem("green_ledger_state");
    if (!saved) return initial;

    try {
      const parsed = JSON.parse(saved);
      const sampleProjectId = "proj-sample-001";
      const sampleProject = initial.projects.find(p => p.id === sampleProjectId);

      if (sampleProject) {
        const existingIdx = parsed.projects.findIndex((p: any) => p.id === sampleProjectId);
        if (existingIdx === -1) {
          // Add if missing
          parsed.projects = [sampleProject, ...parsed.projects];
          if (!parsed.auditLog.some((e: any) => e.projectId === sampleProjectId)) {
            parsed.auditLog = [...initial.auditLog, ...parsed.auditLog];
          }
        } else if (parsed.projects[existingIdx].claimedReduction !== 100) {
          // Update if wrong tonnage
          parsed.projects[existingIdx] = sampleProject;
          // Also update audit log entry if it exists
          const auditIdx = parsed.auditLog.findIndex((e: any) => e.projectId === sampleProjectId && e.actionType === "verification");
          if (auditIdx !== -1) {
            parsed.auditLog[auditIdx] = initial.auditLog[0];
          }
        }
      }
      return parsed;
    } catch (e) {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem("green_ledger_state", JSON.stringify(state));
  }, [state]);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalStore = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalStore must be used within a GlobalStoreProvider");
  }
  return context;
};
